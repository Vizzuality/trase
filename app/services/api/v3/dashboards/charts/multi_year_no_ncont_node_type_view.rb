# Data for stacked bar chart widget
module Api
  module V3
    module Dashboards
      module Charts
        class MultiYearNoNcontNodeTypeView
          include Api::V3::Dashboards::Charts::Helpers

          OTHER = 'OTHER'.freeze

          # @param chart_parameters [Api::V3::Dashboards::ChartParameters]
          def initialize(chart_parameters)
            @chart_parameters = chart_parameters
            @cont_attribute = chart_parameters.cont_attribute
            @context = chart_parameters.context
            @start_year = chart_parameters.start_year
            @end_year = chart_parameters.end_year
            @node_type = chart_parameters.node_type
            @node_type_idx = chart_parameters.node_type_idx
            @top_n = chart_parameters.top_n
            initialize_query
            initialize_top_n_and_others_query
          end

          def call
            break_by_values_indexes = top_nodes_break_by_values_map

            data_by_x = {}
            @top_n_and_others_query.each do |record|
              idx = break_by_values_indexes[record['break_by']]
              data_by_x[record['x']] ||= {}
              data_by_x[record['x']]["y#{idx}"] = record['y0']
            end

            @data = data_by_x.map do |key, value|
              value.symbolize_keys.merge(x: key)
            end

            @meta = {
              xAxis: year_axis_meta,
              yAxis: axis_meta(@cont_attribute, 'number'),
              x: year_legend_meta,
              info: info
            }

            break_by_values_indexes.each do |break_by, idx|
              @meta[:"y#{idx}"] = {
                label: break_by,
                tooltip: {prefix: '', format: '', suffix: ''}
              }
            end

            {data: @data, meta: @meta}
          end

          private

          def initialize_query
            @query = flow_query
            apply_cont_attribute_y
            apply_multi_year_filter
            apply_flow_path_filters

            initialize_top_nodes_query

            apply_year_x
            apply_top_nodes_break_by
          end

          def initialize_top_nodes_query
            @top_nodes_query = @query.
              except(:select).
              select('nodes.id, nodes.name, SUM(flow_quants.value) AS y0').
              joins("JOIN nodes ON nodes.id = flows.path[#{@node_type_idx}]").
              where('NOT nodes.is_unknown').
              except(:group).
              group('nodes.id, nodes.name').
              order(Arel.sql('SUM(flow_quants.value) DESC')).
              limit(@top_n)
          end

          def initialize_top_n_and_others_query
            subquery = <<~SQL
              (
                WITH top_nodes AS (#{@top_nodes_query.to_sql})
                #{@query.to_sql}
              ) flows
            SQL
            @top_n_and_others_query = Api::V3::Flow.from(subquery)
          end

          def apply_top_nodes_break_by
            @query = @query.
              select("COALESCE(top_nodes.name, '#{OTHER}'::TEXT) AS break_by").
              joins("LEFT JOIN top_nodes ON top_nodes.id = flows.path[#{@node_type_idx}]").
              group('top_nodes.name')
          end

          def top_nodes_break_by_values
            @top_nodes_query.
              select(Arel.sql('nodes.name')).
              distinct.map { |r| r['name'] } + [OTHER]
          end

          def top_nodes_break_by_values_map
            Hash[
              top_nodes_break_by_values.map.with_index { |v, idx| [v, idx] }
            ]
          end
        end
      end
    end
  end
end
