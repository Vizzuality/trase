class NodesController < ApplicationController
  def get_all_nodes
    flow_nodes = Flow.select('distinct(unnest(path)) as node_id')
                     .where('flows.context_id = :context_id', context_id: @context.id)

    matching_nodes = Node
                         .select('
                           nodes.node_id, nodes.name, geo_id, nodes.node_type_id as column_id,
                           node_types.node_type as type,
                           CASE WHEN flow_nodes.node_id IS NOT NULL OR nodes.name = \'OTHER\' THEN true ELSE false END as has_flows
                         ')
                         .joins(:node_type)
                         .joins("LEFT OUTER JOIN (#{flow_nodes.to_sql}) flow_nodes ON flow_nodes.node_id = nodes.node_id")
                         .where('flow_nodes.node_id IS NOT NULL OR substring(geo_id from 1 for 2) = :country_code OR nodes.name = \'OTHER\' ', country_code: 'BR')
                         .all()

    render json: matching_nodes, each_serializer: GetAllNodesSerializer
  end
end
