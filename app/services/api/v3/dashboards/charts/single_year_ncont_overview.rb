# Data for donut chart widget
module Api
  module V3
    module Dashboards
      module Charts
        class SingleYearNcontOverview
          include Api::V3::Dashboards::Charts::Helpers
          include Api::V3::Dashboards::Charts::FlowValuesHelpers

          # @param chart_parameters [Api::V3::Dashboards::ChartParameters::FlowValues]
          def initialize(chart_parameters)
            @chart_parameters = chart_parameters
            @cont_attribute = chart_parameters.cont_attribute
            @context = chart_parameters.context
            @year = chart_parameters.start_year
            @ncont_attribute = chart_parameters.ncont_attribute
            initialize_query
          end

          def call
            @data = @query.map do |r|
              r.attributes.slice("x", "y0").symbolize_keys
            end
            @meta = {
              xAxis: axis_meta(@ncont_attribute, "category"),
              yAxis: axis_meta(@cont_attribute, "number"),
              x: legend_meta(@ncont_attribute),
              y0: legend_meta(@cont_attribute),
              info: info
            }
            {data: @data, meta: @meta}
          end

          private

          def initialize_query
            @query = flow_query
            apply_ncont_attribute_x
            apply_cont_attribute_y
            apply_single_year_filter
            apply_flow_path_filters
          end
        end
      end
    end
  end
end
