# Data for stacked bar chart widget
module Api
  module V3
    module Dashboards
      module Charts
        class MultiYearNoNcontNodeTypeView
          include Api::V3::Dashboards::Charts::Helpers
          include Api::V3::Dashboards::Charts::FlowValuesHelpers

          OTHER = 'OTHER'.freeze

          # @param chart_parameters [Api::V3::Dashboards::ChartParameters::FlowValues]
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
              node = top_nodes[idx]
              if node
                profile_info = {
                  id: node['id'],
                  profile: profile_for_node_type_id(node['node_type_id'])
                }
              end
              @meta[:"y#{idx}"] = series_legend_meta(break_by, @cont_attribute).
                merge(profileInfo: profile_info)
            end

            without_string_values = @data.map(&reject_strings)
            total_values = get_total_values(without_string_values)

            @meta[:aggregates] = {total_value: total_values&.except(:x)} # x is a year

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

          def top_nodes
            return @top_nodes if defined? @top_nodes

            @top_nodes = @top_nodes_query.
              select(Arel.sql('nodes.id, nodes.node_type_id, nodes.name')).
              distinct.all
          end

          def top_nodes_break_by_values
            selected_nodes = @chart_parameters.sources_ids + @chart_parameters.companies_ids + @chart_parameters.destinations_ids
            selected_node_types = selected_nodes.map { |id| Api::V3::Node.includes(:node_type).find(id).node_type.id }
            is_current_node_type_in_selected_node_types = selected_node_types.include?(@node_type_idx)
            array = is_current_node_type_in_selected_node_types ? [] : [OTHER]
            top_nodes.map { |r| r['name'] } + array
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
