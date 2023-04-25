# this is for node attributes
module Api
  module V3
    module Profiles
      class IndicatorsTable
        include ActiveSupport::Configurable
        include Api::V3::Profiles::AttributesInitializer

        config_accessor :get_name_and_tooltip do
          Api::V3::AttributeNameAndTooltip
        end

        # @param node [Api::V3::Readonly::NodeWithFlows]
        # @param year [Integer]
        # @param profile_options [Hash]
        # @option profile_options [String] profile_type
        # @option profile_options [String] chart_identifier
        def initialize(node, year, profile_options)
          @node = node
          @year = year
          @context = @node.context
          @values = Api::V3::NodeAttributeValuesPreloader.new(@node, @year)
          @profile_type = profile_options[:profile_type]
          @chart_identifier = profile_options[:chart_identifier]
          initialize_chart_config(@profile_type, nil, @chart_identifier)
        end

        def call
          @chart_config.chart.children.map do |chart|
            chart_config = initialize_chart_config(
              @profile_type, @chart_identifier, chart.identifier
            )

            indicators_group(chart_config)
          end
        end

        private

        def indicators_group(chart_config)
          values = []
          ranking_scores = []
          chart_config.attributes.each do |attribute|
            attribute_value = @values.get(attribute.simple_type, attribute.id)
            values << attribute_value&.value
            next unless @state_ranking.present?

            ranking_scores << @state_ranking.position_for_attribute(
              attribute
            )
          end
          included_columns =
            chart_config.chart_attributes.map do |chart_attribute|
              name_and_tooltip = get_name_and_tooltip.call(
                attribute: chart_attribute.readonly_attribute,
                context: @context,
                defaults: Api::V3::AttributeNameAndTooltip::NameAndTooltip.new(chart_attribute.display_name, chart_attribute.tooltip_text)
              )
              {
                name: name_and_tooltip.display_name,
                unit: chart_attribute.unit,
                tooltip: name_and_tooltip.tooltip_text
              }
            end
          rows = [
            {name: "Score", have_unit: true, values: values}
          ]
          if @state_ranking.present?
            rows << {name: "State Ranking", have_unit: false, values: ranking_scores}
          end
          {
            name: @chart_config.chart.title,
            included_columns: included_columns,
            rows: rows
          }
        end
      end
    end
  end
end
