class NodesController < ApplicationController
  def get_all_nodes
    flow_nodes = Flow.select('distinct(unnest(path)) as node_id')

    node_type_ids = NodeType.
      joins(:context_nodes).
      select('node_types.node_type_id')

    flow_nodes = flow_nodes.where('flows.context_id = :context_id', context_id: @context.id)
    node_type_ids = node_type_ids.where('context_nodes.context_id = :context_id', context_id: @context.id)

    matching_nodes = Node.
      select('
                           nodes.node_id, nodes.name, geo_id, nodes.node_type_id as column_id, nodes.is_domestic_consumption, nodes.is_unknown,
                           node_types.node_type as type, context_nodes.profile_type as profile_type,
                           CASE WHEN flow_nodes.node_id IS NOT NULL OR nodes.name = \'OTHER\' THEN true ELSE false END as has_flows
                         ').
      joins(:node_type).
      joins("LEFT OUTER JOIN (#{flow_nodes.to_sql}) flow_nodes ON flow_nodes.node_id = nodes.node_id").
      joins('LEFT JOIN context_nodes ON context_nodes.node_type_id = nodes.node_type_id').
      where('flow_nodes.node_id IS NOT NULL OR substring(geo_id from 1 for 2) = :country_code OR nodes.name = \'OTHER\' ', country_code: @context.country.iso2).
      where('nodes.node_type_id IN (:node_type_ids)', node_type_ids: node_type_ids).
      where('context_nodes.context_id = :context_id', context_id: @context.id).
      all

    render json: matching_nodes, root: 'data', each_serializer: GetAllNodesSerializer
  end
end
