module Api
  module V3
    module Dashboards
      module SingleYearCharts
        class ChartType
          OTHER = "OTHER".freeze
          THRESHOLD_SCALE = 1.2 # 20%
          RANKING_CHART = :ranking_chart

          attr_reader :data, :default_chart_type

          class << self
            def call(data:, default_chart_type:)
              new(
                data: data,
                default_chart_type: default_chart_type
              ).call
            end
          end

          def initialize(data:, default_chart_type:)
            @data = data
            @default_chart_type = default_chart_type
          end

          def call
            without_other = data.reject { |o| o[:x] == OTHER }
            without_nils_and_x = without_other.map { |o| o.except(:x).compact }
            summed = without_nils_and_x.map { |h| h.inject(0) { |sum, tuple| sum + tuple[1] } }
            max_value = summed.max
            return default_chart_type unless max_value

            # the threshold is OTHER being 20% higher from the max value of the rest
            threshold = max_value * THRESHOLD_SCALE
            other = data.find { |o| o[:x] == OTHER }

            return default_chart_type unless other

            clean_other = other.except(:x).compact
            other_value = clean_other.inject(0) { |sum, tuple| sum + tuple[1] }

            threshold >= other_value ? default_chart_type : RANKING_CHART
          end
        end
      end
    end
  end
end
