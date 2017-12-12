module Api
  module V3
    class NodesAttributesController < ApiController
      def index
        # TODO: use ensure_required_param_present when merged
        unless params[:start_year].present?
          raise ActionController::ParameterMissing,
            'Required param start_year missing'
        end
        # TODO: use ensure_required_param_present when merged
        unless params[:end_year].present?
          raise ActionController::ParameterMissing,
            'Required param end_year missing'
        end

        result = Api::V3::NodeAttributes::Filter.new(
          @context, params[:start_year]&.to_i, params[:end_year]&.to_i
        )

        # node_ids = Node.
        #   select('node_id').
        #   joins('LEFT JOIN context_nodes ON nodes.node_type_id = context_nodes.node_type_id').
        #   where('context_nodes.context_id = ?', @context.id)

        # ind_values = NodeInd.get_attributes_for_nodes(node_ids, @context.id, start_year, end_year)

        # quant_values = NodeQuant.get_attributes_for_nodes(node_ids, @context.id, start_year, end_year)

        # render json: {data: ind_values + quant_values}
        if result.errors.any?
          render json: result.errors
        else
          render json: result,
                 root: :data,
                 rach_serializer: Api::V3::NodeAttributesSerializer
        end
      end

      private

      def set_filter_params
        @filter_params = {
          year_start: params[:year_start],
          year_end: params[:year_end] || params[:year_start],
          limit: params[:n_nodes]
        }
      end
    end
  end
end

SELECT 
node_inds.node_id, 
node_inds.ind_id AS attribute_id, 
'ind' AS attribute_type, 
SUM(node_inds.value) as value, 
CASE 
WHEN SUM(node_inds.value) >= context_layer.bucket_3[2] THEN 3 
WHEN SUM(node_inds.value) >= context_layer.bucket_3[1] THEN 2 
WHEN SUM(node_inds.value) > 0 THEN 1 ELSE 0 
END as bucket3, 
CASE WHEN SUM(node_inds.value) >= context_layer.bucket_5[4] THEN 5 
WHEN SUM(node_inds.value) >= context_layer.bucket_5[3] THEN 4 
WHEN SUM(node_inds.value) >= context_layer.bucket_5[2] THEN 3 
WHEN SUM(node_inds.value) >= context_layer.bucket_5[1] THEN 2 
WHEN SUM(node_inds.value) > 0 THEN 1 ELSE 0 END as bucket5 
FROM "node_inds" 
LEFT JOIN context_layer ON context_layer.layer_attribute_id = node_inds.ind_id and context_layer.layer_attribute_type = 'Ind' 
WHERE "node_inds"."node_id" IN (
    SELECT "nodes"."node_id" 
    FROM "nodes" 
    LEFT JOIN context_nodes ON nodes.node_type_id = context_nodes.node_type_id 
    WHERE (context_nodes.context_id = 1)
) AND (
    node_inds.year IN (2014,2015) OR node_inds.year IS NULL
) 
AND (context_layer.context_id = 1) 
AND (context_id = 1) 
AND (context_layer.enabled = TRUE) 
AND (context_layer.years IS NULL OR context_layer.years && ARRAY[2014,2015]) 
GROUP BY node_inds.node_id, node_inds.ind_id, context_layer.bucket_5, context_layer.bucket_3;

SELECT 
node_inds.node_id, 
node_inds.ind_id AS attribute_id, 
'ind' AS attribute_type, 
SUM(node_inds.value) as value, 
CASE 
WHEN SUM(node_inds.value) >= map_attributes.bucket_3[2] THEN 3 
WHEN SUM(node_inds.value) >= map_attributes.bucket_3[1] THEN 2 
WHEN SUM(node_inds.value) > 0 THEN 1 ELSE 0 
END as bucket3, 
CASE WHEN SUM(node_inds.value) >= map_attributes.bucket_5[4] THEN 5 
WHEN SUM(node_inds.value) >= map_attributes.bucket_5[3] THEN 4 
WHEN SUM(node_inds.value) >= map_attributes.bucket_5[2] THEN 3 
WHEN SUM(node_inds.value) >= map_attributes.bucket_5[1] THEN 2 
WHEN SUM(node_inds.value) > 0 THEN 1 ELSE 0 END as bucket5 
FROM revamp.node_inds

LEFT JOIN revamp.map_inds ON map_inds.ind_id = node_inds.ind_id
LEFT JOIN revamp.map_attributes ON map_attributes.id = map_inds.map_attribute_id
LEFT JOIN revamp.map_attribute_groups ON map_attribute_groups.id = map_attributes.map_attribute_group_id 
WHERE "node_inds"."node_id" IN (
    SELECT "nodes"."node_id" 
    FROM "nodes" 
    JOIN context_nodes ON nodes.node_type_id = context_nodes.node_type_id 
    WHERE (context_nodes.context_id = 1)
) AND (
    node_inds.year IN (2014,2015) OR node_inds.year IS NULL
) 
AND (map_attribute_groups.context_id = 1) 
AND (context_id = 1) 
AND NOT map_attributes.is_disabled
AND (map_attributes.years IS NULL OR map_attributes.years && ARRAY[2014,2015]) 
GROUP BY node_inds.node_id, node_inds.ind_id, map_attributes.bucket_5, map_attributes.bucket_3;

SELECT nodes.id AS node_id,
node_inds.ind_id AS attribute_id, 
'ind' AS attribute_type, 
SUM(node_inds.value) AS value, 
CASE 
WHEN SUM(node_inds.value) >= map_attributes.bucket_3[2] THEN 3 
WHEN SUM(node_inds.value) >= map_attributes.bucket_3[1] THEN 2 
WHEN SUM(node_inds.value) > 0 THEN 1 ELSE 0 
END as bucket3, 
CASE WHEN SUM(node_inds.value) >= map_attributes.bucket_5[4] THEN 5 
WHEN SUM(node_inds.value) >= map_attributes.bucket_5[3] THEN 4 
WHEN SUM(node_inds.value) >= map_attributes.bucket_5[2] THEN 3 
WHEN SUM(node_inds.value) >= map_attributes.bucket_5[1] THEN 2 
WHEN SUM(node_inds.value) > 0 THEN 1 ELSE 0 END as bucket5 
FROM revamp.nodes
JOIN revamp.context_node_types ON context_node_types.node_type_id = nodes.node_type_id
JOIN revamp.node_inds ON nodes.id = node_inds.node_id
LEFT JOIN revamp.map_inds ON map_inds.ind_id = node_inds.ind_id
LEFT JOIN revamp.map_attributes ON map_attributes.id = map_inds.map_attribute_id
LEFT JOIN revamp.map_attribute_groups ON map_attribute_groups.id = map_attributes.map_attribute_group_id 
WHERE context_node_types.context_id = 1
AND node_inds.year IN (2014,2015) OR node_inds.year IS NULL
AND NOT map_attributes.is_disabled
AND (map_attributes.years IS NULL OR map_attributes.years && ARRAY[2014,2015])
GROUP BY nodes.id, 
node_inds.ind_id,
map_attributes.bucket_3,
map_attributes.bucket_5