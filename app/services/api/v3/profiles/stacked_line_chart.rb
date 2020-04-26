module Api
  module V3
    module Profiles
      class StackedLineChart
        include ActiveSupport::Configurable
        include Api::V3::Profiles::AttributesInitializer

        config_accessor :get_tooltip do
          Api::V3::Profiles::GetTooltipPerAttribute
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
          @years = fetch_years
          lines = fetch_lines
          {
            included_years: years,
            unit: 'ha',
            lines: lines
          }
        end

        private

        attr_reader :years

        def fetch_lines
          @chart_config.chart_attributes.map.with_index do |chart_attribute, idx|
            {
              name: chart_attribute.display_name,
              legend_name: chart_attribute.legend_name,
              legend_tooltip: get_tooltip.call(
                ro_chart_attribute: chart_attribute,
                context: @context
              ),
              type: chart_attribute.display_type,
              style: chart_attribute.display_style,
              values: values_getter(get_values(chart_attribute, idx))
            }
          end
        end

        def fetch_years
          min_years = []
          max_years = []
          @chart_config.attributes.each do |attribute|
            min_max =
              if attribute.is_a? Api::V3::Quant
                @node.node_quants.where(quant_id: attribute.id)
              elsif attribute.is_a? Api::V3::Ind
                @node.node_inds.where(ind_id: attribute.id)
              end
            min_max = min_max.
              except(:select).
              select('MIN(year), MAX(year)').
              order(nil).
              first
            next unless min_max

            min_years << min_max['min']
            max_years << min_max['max']
          end
          min_year = min_years.compact.min
          max_year = max_years.compact.max
          return [] unless min_year && max_year

          (min_year..max_year).to_a
        end

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

        def get_values(chart_attribute, idx)
          data = get_data(chart_attribute, @chart_config.attributes[idx])
          Hash[data.map { |element| [element['year'], element] }]
        end

        def get_data(chart_attribute, attribute)
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

        def values_getter(values)
          years.map do |year|
            values_of_year = values[year]
            values_of_year['value'] unless values_of_year.blank?
          end
        end
      end
    end
  end
end
