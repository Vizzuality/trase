module Api
  module V3
    module Places
      class IndicatorsTable
        include ActiveSupport::Configurable
        include Api::V3::Profiles::AttributesInitializer

        config_accessor :get_tooltip do
          Api::V3::Profiles::GetTooltipPerAttribute
        end

        # @param context [Api::V3::Context]
        # @param node [Api::V3::Node]
        # @param year [Integer]
        def initialize(context, node, year)
          @context = context
          @node = node
          @year = year
          @values = Api::V3::NodeAttributeValuesPreloader.new(@node, @year)
          initialize_state_ranking
        end

        def call
          parent_chart_config = initialize_chart_config(
            :place, nil, :place_indicators_table
          )
          parent_chart_config.chart.children.map do |chart|
            chart_config = initialize_chart_config(
              :place, :place_indicators_table, chart.identifier
            )
            unless chart_config.attributes.any?
              raise ActiveRecord::RecordNotFound.new 'No attributes found'
            end

            indicators_group(chart_config)
          end
        end

        private

        def initialize_state_ranking
          # This remains hardcoded, because it only makes sense
          # for Brazil soy for now
          state_qual = Api::V3::Qual.find_by_name(NodeTypeName::STATE)
          return unless state_qual

          state_name = @values.get(state_qual.simple_type, state_qual.id)
          return unless state_name.present?

          @state_ranking = StateRanking.new(@context, @node, @year, state_name)
        end

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
          {
            name: @chart_config.chart.title,
            included_columns: included_columns,
            rows: [
              {name: 'Score', have_unit: true, values: values},
              {name: 'State Ranking', have_unit: false, values: ranking_scores}
            ]
          }
        end
      end
    end
  end
end
