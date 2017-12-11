module Api
  module V3
    class NodesController < ApiController
      def index
        nodes_with_flows = Api::V3::Flow.
          select('DISTINCT(UNNEST(path)) AS node_id').
          where(context_id: @context.id)

        nodes = Api::V3::Node.
          select('
                 nodes.id, nodes.main_id, nodes.name, geo_id, nodes.node_type_id AS column_id,
                 NULLIF(node_properties.is_domestic_consumption, FALSE) AS is_domestic_consumption, NULLIF(nodes.is_unknown, FALSE) AS is_unknown,
                 node_types.name AS type, profiles.name::TEXT AS profile_type,
                 CASE WHEN nodes_with_flows.node_id IS NOT NULL OR nodes.name = \'OTHER\' THEN true ELSE false END AS has_flows
                 ').
          joins(:node_property).
          joins(node_type: :context_node_types).
          joins('LEFT JOIN profiles ON profiles.context_node_type_id = context_node_types.id').
          joins("LEFT OUTER JOIN (#{nodes_with_flows.to_sql}) nodes_with_flows ON nodes_with_flows.node_id = nodes.id").
          where('nodes_with_flows.node_id IS NOT NULL OR SUBSTRING(geo_id FROM 1 FOR 2) = ? OR nodes.name = \'OTHER\' ', @context.country.iso2).
          where('context_node_types.context_id' => @context.id).
          all

        render json: nodes, root: 'data',
               each_serializer: Api::V3::Nodes::NodeSerializer
      end
    end
  end
end
