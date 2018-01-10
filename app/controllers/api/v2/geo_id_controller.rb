module Api
  module V2
    class GeoIdController < ApiController
      def index
        nodes_ids = params[:nodes_ids]
        target_column_id = params[:target_column_id]
        years = params[:years]

        raise ActionController::ParameterMissing, 'Required nodes_ids missing' if nodes_ids.nil?
        raise ActionController::ParameterMissing, 'Required target_column_id missing' if target_column_id.nil?
        raise ActionController::ParameterMissing, 'Required year missing' if years.nil?

        target_column_id = target_column_id.to_i

        min_path_length_query = Node.joins('JOIN node_types ON nodes.node_type_id = node_types.node_type_id').
          select('count(distinct node_types.node_type_id) as distinct_count').
          where(['nodes.node_id IN (:nodes_ids)', {nodes_ids: nodes_ids}])
        min_path_length = min_path_length_query[0].distinct_count

        node_index = NodeType.node_index_for_id(@context, target_column_id)

        flows_join_clause = ActiveRecord::Base.send(
          :sanitize_sql_array,
          ['JOIN flows ON nodes.node_id = flows.path[?]', node_index]
        )

        matching_nodes = Node.joins(flows_join_clause).
          where('context_id = :context_id',
                context_id: @context.id).
          where('icount(ARRAY[:nodes_ids]::int[] & flows.path) >= :min_path_length',
                min_path_length: min_path_length, nodes_ids: nodes_ids).
          where('flows.year IN (:years)',
                years: years).group('nodes.node_id')

        render json: matching_nodes, each_serializer: LinkedGeoIdsSerializer
      end
    end
  end
end
