# Data for dynamic sentence widget
module Api
  module V3
    module Dashboards
      module Charts
        class MultiYearNodeValuesOverview
          include Api::V3::Dashboards::Charts::Helpers
          include Api::V3::Dashboards::Charts::NodeValuesHelpers

          # @param chart_parameters [Api::V3::Dashboards::ChartParameters::NodeValues]
          def initialize(chart_parameters)
            @chart_parameters = chart_parameters
            @cont_attribute = chart_parameters.cont_attribute
            @context = chart_parameters.context
            @node = chart_parameters.node
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
            @query = @cont_attribute.original_attribute.
              node_values.
              where(node_id: @node.id).
              select("SUM(value) AS y0").
              group(:node_id)
            apply_year_x
            apply_multi_year_filter
          end
        end
      end
    end
  end
end
