module Api
  module V3
    class NodesController < ApiController
      def index
        flow_nodes = Api::V3::Flow.select('distinct(unnest(path)) as node_id')

        node_type_ids = Api::V3::NodeType.
            joins(:context_node_types).
            select('node_types.id')

        flow_nodes = flow_nodes.where('flows.context_id = :context_id', context_id: @context.id)
        node_type_ids = node_type_ids.where('context_node_types.context_id = :context_id', context_id: @context.id)

        matching_nodes = Api::V3::Node.
            select('
                   nodes.id as node_id, nodes.main_id, nodes.name, geo_id, nodes.node_type_id as column_id,
                   node_properties.is_domestic_consumption, nodes.is_unknown,
                   node_types.name as type, profiles.name as profile_type,
                   CASE WHEN flow_nodes.node_id IS NOT NULL OR nodes.name = \'OTHER\' THEN true ELSE false END as has_flows
                   ').
            joins(:node_type).
            joins(:node_property).
            joins("LEFT OUTER JOIN (#{flow_nodes.to_sql}) flow_nodes ON flow_nodes.node_id = nodes.id").
            joins("INNER JOIN context_node_types on context_node_types.node_type_id = node_types.id AND context_node_types.context_id = #{@context.id}").
            joins('INNER JOIN profiles on profiles.context_node_type_id = context_node_types.id').
            where('flow_nodes.node_id IS NOT NULL OR substring(geo_id from 1 for 2) = :country_code OR nodes.name = \'OTHER\' ', country_code: @context.country.iso2).
            where('nodes.node_type_id IN (:node_type_ids)', node_type_ids: node_type_ids).
            all

        render json: matching_nodes, root: 'data', each_serializer: GetAllNodesSerializer
      end
    end
  end
end
