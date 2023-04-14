# Data for stacked bar chart widget
module Api
  module V3
    module Dashboards
      module Charts
        class MultiYearNcontOverview
          include Api::V3::Dashboards::Charts::Helpers
          include Api::V3::Dashboards::Charts::FlowValuesHelpers

          # @param chart_parameters [Api::V3::Dashboards::ChartParameters::FlowValues]
          def initialize(chart_parameters)
            @chart_parameters = chart_parameters
            @cont_attribute = chart_parameters.cont_attribute
            @context = chart_parameters.context
            @start_year = chart_parameters.start_year
            @end_year = chart_parameters.end_year
            @ncont_attribute = chart_parameters.ncont_attribute
            initialize_query
          end

          def call
            break_by_values = @query.map { |e| e["break_by"] }.uniq.sort

            data_by_x = {}
            @query.each do |record|
              idx = break_by_values.index(record["break_by"])
              data_by_x[record["x"]] ||= {}
              data_by_x[record["x"]]["y#{idx}"] = record["y0"]
            end

            @data = data_by_x.map do |key, value|
              value.symbolize_keys.merge(x: key)
            end

            @meta = {
              xAxis: year_axis_meta,
              yAxis: axis_meta(@cont_attribute, "number"),
              x: year_legend_meta,
              info: info
            }

            break_by_values.each.with_index do |break_by, idx|
              @meta[:"y#{idx}"] = series_legend_meta(break_by, @cont_attribute)
            end

            {data: @data, meta: @meta}
          end

          private

          def initialize_query
            @query = flow_query
            apply_year_x
            apply_ncont_attribute_break_by
            apply_cont_attribute_y
            apply_multi_year_filter
            apply_flow_path_filters
          end
        end
      end
    end
  end
end
