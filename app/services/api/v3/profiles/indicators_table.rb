# this is for node attributes
module Api
  module V3
    module Profiles
      class IndicatorsTable
        include ActiveSupport::Configurable
        include Api::V3::Profiles::AttributesInitializer

        config_accessor :get_tooltip do
          Api::V3::Profiles::GetTooltipPerAttribute
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
            value = @values.get(attribute.simple_type, attribute.id)
            values << value
            next unless @state_ranking.present?

            ranking_scores << @state_ranking.position_for_attribute(
              attribute
            )
          end
          included_columns =
            chart_config.chart_attributes.map do |chart_attribute|
              {
                name: chart_attribute.display_name,
                unit: chart_attribute.unit,
                tooltip: get_tooltip.call(
                  ro_chart_attribute: chart_attribute,
                  context: @context
                )
              }
            end
          rows = [
            {name: 'Score', have_unit: true, values: values}
          ]
          if @state_ranking.present?
            rows << {name: 'State Ranking', have_unit: false, values: ranking_scores}
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
