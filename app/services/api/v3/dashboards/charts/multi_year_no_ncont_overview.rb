# Data for bar chart widget
module Api
  module V3
    module Dashboards
      module Charts
        class MultiYearNoNcontOverview
          include Api::V3::Dashboards::Charts::Helpers
          include Api::V3::Dashboards::Charts::FlowValuesHelpers

          # @param chart_parameters [Api::V3::Dashboards::ChartParameters::FlowValues]
          def initialize(chart_parameters)
            @chart_parameters = chart_parameters
            @cont_attribute = chart_parameters.cont_attribute
            @context = chart_parameters.context
            @start_year = chart_parameters.start_year
            @end_year = chart_parameters.end_year
            initialize_query
          end

          def call
            @data = @query.map do |r|
              r.attributes.slice("x", "y0").symbolize_keys
            end
            @meta = {
              xAxis: year_axis_meta,
              yAxis: axis_meta(@cont_attribute, "number"),
              x: year_legend_meta,
              y0: legend_meta(@cont_attribute),
              info: info
            }
            {data: @data, meta: @meta}
          end

          private

          def initialize_query
            @query = flow_query
            apply_year_x
            apply_cont_attribute_y
            apply_multi_year_filter
            apply_flow_path_filters
          end
        end
      end
    end
  end
end
