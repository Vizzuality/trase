module Api
  module V3
    module LinkedNodes
      class Filter
        def initialize(context, nodes_ids, node_type_id, years)
          @context = context
          @nodes_ids = nodes_ids
          @node_index = Api::V3::NodeType.node_index_for_id(@context, node_type_id)
          @years = years
        end

        def result
          min_path_length_query = Api::V3::Node.
            select("COUNT(DISTINCT nodes.node_type_id) AS distinct_count").
            where(id: @nodes_ids)
          min_path_length = min_path_length_query[0].distinct_count

          flows_join_clause = ActiveRecord::Base.send(
            :sanitize_sql_array,
            ["JOIN flows ON nodes.id = flows.path[?]", @node_index]
          )

          Api::V3::Node.
            select([:id, :geo_id, :main_id, :name, :node_type_id, :is_unknown]).
            select("node_properties.is_domestic_consumption AS is_domestic_consumption").
            joins(:node_property).
            joins(flows_join_clause).
            where("flows.context_id" => @context.id).
            where("flows.year" => @years).
            where(
              "public.ICOUNT(ARRAY[:node_id]::int[] operator(public.&) flows.path) >= :min_path_length",
              min_path_length: min_path_length, node_id: @nodes_ids
            ).
            group("nodes.id", "node_properties.is_domestic_consumption")
        end
      end
    end
  end
end
