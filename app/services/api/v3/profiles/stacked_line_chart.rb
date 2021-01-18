module Api
  module V3
    module Profiles
      class StackedLineChart
        include ActiveSupport::Configurable
        include Api::V3::Profiles::AttributesInitializer

        config_accessor :get_name_and_tooltip do
          Api::V3::AttributeNameAndTooltip
        end

        # @param context [Api::V3::Context]
        # @param node [Api::V3::Readonly::NodeWithFlows]
        # @param year [Integer]
        # @param profile_options [Hash]
        # @option profile_options [String] profile_type
        # @option profile_options [String] chart_identifier
        def initialize(context, node, year, profile_options)
          @context = context
          @node = node
          @year = year
          @profile_type = profile_options[:profile_type]
          @chart_identifier = profile_options[:chart_identifier]
          @chart_config = initialize_chart_config(
            @profile_type, nil, @chart_identifier
          )
          initialize_state_ranking
        end

        def call
          values = fetch_values
          years = extract_years(values)
          formatted_values = format_values(values, years)
          result = {
            included_years: years,
            # unit: 'ha',
            lines: formatted_values
          }
          units = @chart_config.attributes.map(&:unit).uniq
          if units.size > 1
            result[:multi_unit] = true
            result[:unit] = nil
          else
            result[:multi_unit] = false
            result[:unit] = units.first
          end
          result
        end

        private

        def initialize_state_ranking
          # This remains hardcoded, because it only makes sense
          # for Brazil soy for now
          state_qual = Api::V3::Qual.find_by_name(NodeTypeName::STATE)
          return unless state_qual

          @values = Api::V3::NodeAttributeValuesPreloader.new(@node, @year)
          state_name = @values.get(state_qual.simple_type, state_qual.id)
          return unless state_name.present?

          @state_ranking = Api::V3::Places::StateRanking.new(@context, @node, @year, state_name)
        end

        def fetch_values
          @chart_config.chart_attributes.map.with_index do |chart_attribute, idx|
            attribute = @chart_config.attributes[idx]
            data = fetch_values_for_attribute(chart_attribute, attribute)
            Hash[data.map { |element| [element['year'], element] }]
          end
        end

        def fetch_values_for_attribute(chart_attribute, attribute)
          attribute_id = attribute.id
          if chart_attribute.state_average && @state_ranking
            @state_ranking.average_for_attribute(
              attribute
            )
          elsif attribute.is_a? Api::V3::Quant
            @node.node_quants.where(quant_id: attribute_id)
          elsif attribute.is_a? Api::V3::Ind
            @node.node_inds.where(ind_id: attribute_id)
          end
        end

        def extract_years(values)
          all_years = values.map { |v| v.keys }.flatten.uniq.sort
          min_year = all_years.first
          max_year = all_years.last
          return [] unless min_year && max_year

          (min_year..max_year).to_a
        end

        def format_values(values, years)
          @chart_config.chart_attributes.map.with_index do |chart_attribute, idx|
            attribute = @chart_config.attributes[idx]
            name_and_tooltip = get_name_and_tooltip.call(
              attribute: chart_attribute.readonly_attribute,
              context: @context,
              defaults: Api::V3::AttributeNameAndTooltip::NameAndTooltip.new(chart_attribute.display_name, chart_attribute.tooltip_text)
            )
            {
              name: name_and_tooltip.display_name,
              legend_name: chart_attribute.legend_name,
              legend_tooltip: name_and_tooltip.tooltip_text,
              unit: attribute.unit,
              type: chart_attribute.display_type,
              style: chart_attribute.display_style,
              values: inject_missing_values(values[idx], years)
            }
          end
        end

        def inject_missing_values(values, years)
          years.map do |year|
            values_of_year = values[year]
            values_of_year['value'] unless values_of_year.blank?
          end
        end
      end
    end
  end
end
