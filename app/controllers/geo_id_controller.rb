class GeoIdController < ApplicationController

  def index
    node_id = params[:node_id]

    raise ActionController::ParameterMissing, 'Required node_id missing' if node_id.nil?

    fancy_query = Node.joins('JOIN column_groups ON nodes.type = column_groups.column_type')
                .select('count(distinct column_groups.id) as distinct_count')
                .where(['nodes.node_id IN (:node_id)', {node_id: node_id}])
    path_length = fancy_query[0].distinct_count

    result = Node.joins('JOIN flows ON nodes.node_id = ANY(flows.path[1:4])')
                 .where(['ARRAY[:node_id] && flows.path AND com_id = :com_id AND country_id = :country_id', {node_id: node_id, country_id: @country.id, com_id: @commodity.id}])

    render json:
  end

end
