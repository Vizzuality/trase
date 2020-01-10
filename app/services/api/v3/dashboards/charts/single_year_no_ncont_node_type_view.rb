# Data for horizontal bar chart widget
module Api
  module V3
    module Dashboards
      module Charts
        class SingleYearNoNcontNodeTypeView
          include Api::V3::Dashboards::Charts::Helpers
          include Api::V3::Dashboards::Charts::FlowValuesHelpers

          OTHER = 'OTHER'.freeze

          # @param chart_parameters [Api::V3::Dashboards::ChartParameters::FlowValues]
          def initialize(chart_parameters)
            @chart_parameters = chart_parameters
            @cont_attribute = chart_parameters.cont_attribute
            @context = chart_parameters.context
            @year = chart_parameters.start_year
            @node_type = chart_parameters.node_type
            @node_type_idx = chart_parameters.node_type_idx
            @top_n = chart_parameters.top_n
            initialize_query
            initialize_top_n_and_others_query
          end

          def call
            @data = []
            x_labels_profile_info = []
            profile = profile_for_node_type_id(@node_type.id)
            @top_n_and_others_query.map do |record|
              x_labels_profile_info << {id: record['id'], profile: profile}
              @data << record.attributes.slice('x', 'y0').symbolize_keys
            end
            if (last = @data.last) && last[:x] == OTHER && last[:y0].blank?
              @data.pop
              x_labels_profile_info.pop
            end

            @meta = {
              xAxis: node_type_axis_meta(@node_type),
              xLabelsProfileInfo: x_labels_profile_info,
              yAxis: axis_meta(@cont_attribute, 'number'),
              x: node_type_legend_meta(@node_type),
              y0: legend_meta(@cont_attribute),
              info: info
            }

            swap_x_and_y

            without_string_values = @data.map(&reject_strings)
            total_values = get_total_values(without_string_values)

            @meta[:aggregates] = {total_value: total_values}

            {data: @data, meta: @meta}
          end

          private

          def initialize_query
            @query = flow_query
            apply_node_type_x
            apply_cont_attribute_y
            apply_single_year_filter
            apply_flow_path_filters
          end

          def initialize_top_n_and_others_query
            subquery = <<~SQL
              (
                WITH q AS (#{@query.to_sql}),
                u1 AS (SELECT id, node_type_id, x, y0 FROM q WHERE NOT is_unknown ORDER BY y0 DESC LIMIT #{@top_n}),
                u2 AS (
                  SELECT NULL::INT, NULL::INT, '#{OTHER}'::TEXT AS x, SUM(y0) AS y0 FROM q
                  WHERE NOT EXISTS (SELECT 1 FROM u1 WHERE q.x = u1.x)
                )
                SELECT * FROM u1
                UNION ALL
                SELECT * FROM u2
              ) flows
            SQL
            @top_n_and_others_query = Api::V3::Flow.from(subquery)
          end
        end
      end
    end
  end
end
