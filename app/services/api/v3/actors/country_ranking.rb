module Api
  module V3
    module Actors
      class CountryRanking
        # @param context [Api::V3::Context]
        # @param node [Api::V3::Readonly::NodeWithFlows]
        # @year [Integer]
        def initialize(context, node, year)
          @context = context
          @node = node
          @year = year
          @node_index = Api::V3::NodeType.node_index_for_id(
            @context, @node.node_type_id
          )
        end

        # Returns the node's ranking across all nodes of same type within given:
        # source country, year
        # for attribute (quant or ind)
        def position_for_attribute(attribute)
          attribute_type = attribute.class.name.demodulize.downcase
          value_table = "flow_#{attribute_type}s"

          # rubocop:disable Layout/LineLength
          select_clause = ActiveRecord::Base.send(
            :sanitize_sql_array,
            [
              "path[?] AS node_id, DENSE_RANK() OVER (ORDER BY SUM(#{value_table}.value) DESC) AS rank",
              @node_index
            ]
          )
          # rubocop:enable Layout/LineLength
          nodes_join_clause = ActiveRecord::Base.send(
            :sanitize_sql_array,
            ["JOIN nodes ON nodes.id = flows.path[?]", @node_index]
          )
          group_clause = ActiveRecord::Base.send(
            :sanitize_sql_array,
            [
              "flows.context_id, flows.year, path[?]",
              @node_index
            ]
          )
          query = Flow.
            select(select_clause).
            joins("JOIN #{value_table} ON flows.id = #{value_table}.flow_id").
            joins(nodes_join_clause).
            joins("JOIN node_properties ON node_properties.node_id = nodes.id").
            where("#{value_table}.#{attribute_type}_id" => attribute.id).
            where("flows.year" => @year, "context_id" => @context.id).
            where("NOT node_properties.is_domestic_consumption").
            where("NOT is_unknown").
            group(group_clause)

          result = Node.from("(" + query.to_sql + ") s").
            select("s.*").
            where("s.node_id" => @node.id).
            order("rank ASC").
            first

          result && result["rank"] || nil
        end
      end
    end
  end
end
