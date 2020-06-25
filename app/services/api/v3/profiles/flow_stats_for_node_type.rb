module Api
  module V3
    module Profiles
      class FlowStatsForNodeType
        def initialize(context, year, node_type_name)
          @context = context
          @year = year
          @node_type_name = node_type_name
          @node_index = Api::V3::NodeType.node_index_for_name(@context, node_type_name)
        end

        def nodes_with_flows_count(attribute)
          Api::V3::Node.from(
            '(' + nodes_with_flows(attribute).to_sql + ') s'
          ).count
        end

        def nodes_with_flows_into_node_count(attribute, node)
          node_index = Api::V3::NodeType.node_index_for_id(@context, node.node_type_id)
          Api::V3::Node.from(
            '(' +
            nodes_with_flows(attribute).
              where('flows.path[?] = ?', node_index, node.id).to_sql +
            ') s'
          ).count
        end

        def nodes_with_flows_into_node_by_year(attribute, node)
          node_index = Api::V3::NodeType.node_index_for_id(@context, node.node_type_id)
          nodes_with_flow_totals_by_year(attribute).
            where('flows.path[?] = ?', node_index, node.id).
            where('nodes.id' => top_nodes.map { |n| n['node_id'] })
        end

        def nodes_with_flows_totals(attribute)
          attribute_type = attribute.class.name.demodulize.downcase
          flow_values = :"flow_#{attribute_type}s"
          nodes_join_clause = ActiveRecord::Base.send(
            :sanitize_sql_array,
            [
              'JOIN nodes ON nodes.id = flows.path[?]', @node_index
            ]
          )
          Api::V3::Flow.
            select(
              [
                'nodes.id AS node_id',
                'nodes.name',
                "SUM(#{flow_values}.value::DOUBLE PRECISION) AS value"
              ].join(', ')
            ).
            joins(nodes_join_clause).
            joins('JOIN node_properties ON nodes.id = node_properties.node_id').
            joins("JOIN partitioned_#{flow_values} #{flow_values} ON #{flow_values}.flow_id = flows.id").
            where('flows.context_id' => @context.id).
            where("#{flow_values}.#{attribute_type}_id" => attribute.id).
            where('flows.year' => @year).
            where('NOT nodes.is_unknown').
            where('NOT node_properties.is_domestic_consumption').
            group('nodes.id, nodes.name')
        end

        private

        def nodes_with_flows_all_years(attribute)
          attribute_type = attribute.class.name.demodulize.downcase
          flow_values = :"flow_#{attribute_type}s"
          select_clause = ActiveRecord::Base.send(
            :sanitize_sql_array,
            ['flows.path[?] AS node_id', @node_index]
          )
          group_clause = ActiveRecord::Base.send(
            :sanitize_sql_array,
            ['flows.path[?]', @node_index]
          )
          Api::V3::Flow.
            select(select_clause).
            joins(flow_values).
            where("#{flow_values}.#{attribute_type}_id" => attribute.id).
            where(context_id: @context.id).
            group(group_clause)
        end

        def nodes_with_flows_totals_by_year(attribute)
          attribute_type = attribute.class.name.demodulize.downcase
          flow_values = :"flow_#{attribute_type}s"

          select_clause = ActiveRecord::Base.send(
            :sanitize_sql_array,
            [
              "flows.path[?] AS node_id, nodes.name AS name, year, \
    SUM(#{flow_values}.value::DOUBLE PRECISION) AS value",
              @node_index
            ]
          )
          nodes_join_clause = ActiveRecord::Base.send(
            :sanitize_sql_array,
            ['JOIN nodes ON nodes.id = flows.path[?]', @node_index]
          )
          group_clause = ActiveRecord::Base.send(
            :sanitize_sql_array,
            ['flows.path[?], nodes.name, year', @node_index]
          )

          nodes_with_flows_all_years(attribute).
            except(:select).
            except(:group).
            select(select_clause).
            joins(nodes_join_clause).
            group(group_clause)
        end

        def nodes_with_flows(attribute)
          nodes_with_flows_all_years(attribute).where(year: @year)
        end
      end
    end
  end
end
