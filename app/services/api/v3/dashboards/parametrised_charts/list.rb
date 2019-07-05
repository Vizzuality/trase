module Api
  module V3
    module Dashboards
      module ParametrisedCharts
        class List
          # @param chart_parameters [Api::V3::Dashboards::ChartParameters::FlowValues]
          def initialize(chart_parameters)
            @chart_parameters = chart_parameters
          end

          def call
            FlowValuesCharts.new(@chart_parameters).call +
              NodeValuesCharts.new(@chart_parameters).call
          end
        end
      end
    end
  end
end
