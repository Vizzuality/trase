class GeoIdController < ApplicationController

  def index
    node_id = params[:node_id]
    target_column_id = params[:target_column_id].to_i
    years = params[:year]

    raise ActionController::ParameterMissing, 'Required node_id missing' if node_id.nil?
    raise ActionController::ParameterMissing, 'Required target_column missing' if target_column_id.nil?
    raise ActionController::ParameterMissing, 'Required year missing' if years.nil?

    min_path_length_query = Node.joins('JOIN node_types ON nodes.node_type_id = node_types.node_type_id')
                      .select('count(distinct node_types.node_type_id) as distinct_count')
                      .where(['nodes.node_id IN (:node_id)', {node_id: node_id}])
    min_path_length = min_path_length_query[0].distinct_count

    matching_nodes = Node.joins('JOIN flows ON nodes.node_id = flows.path[' + Node.sanitize(target_column_id) + ']')
                 .where('context_id = :context_id',
                        context_id: @context.id)
                 .where('icount(ARRAY[:node_id]::int[] & flows.path) >= :min_path_length',
                        min_path_length: min_path_length, node_id: node_id)
                 .where('flows.year IN (:years)',
                        years: years)

    render json: matching_nodes
  end

end
