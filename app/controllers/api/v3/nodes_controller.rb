module Api
  module V3
    class NodesController < ApiController
      def node_attributes

        start_year = params[:start_year].to_i
        end_year = params[:end_year].to_i

        unless params[:start_year].present?
          raise ActionController::ParameterMissing, 'Required start_year missing'
        end

        unless params[:end_year].present?
          raise ActionController::ParameterMissing, 'Required end_year missing'
        end

        node_ids = Node
                     .select('node_id')
                     .joins('LEFT JOIN context_nodes ON nodes.node_type_id = context_nodes.node_type_id')
                     .where('context_nodes.context_id = ?', @context.id)

        ind_values = NodeInd
                       .select('node_inds.node_id, node_inds.ind_id AS attribute_id, \'Ind\' AS attribute_type, SUM(node_inds.value) as value')
                       .select('CASE WHEN SUM(node_inds.value) >= context_layer.bucket_3[2] THEN 3 WHEN SUM(node_inds.value) >= context_layer.bucket_3[1] THEN 2 WHEN SUM(node_inds.value) > 0 THEN 1 ELSE 0 END as bucket3')
                       .select('CASE WHEN SUM(node_inds.value) >= context_layer.bucket_5[4] THEN 5 WHEN SUM(node_inds.value) >= context_layer.bucket_5[3] THEN 4 WHEN SUM(node_inds.value) >= context_layer.bucket_5[2] THEN 3 WHEN SUM(node_inds.value) >= context_layer.bucket_5[1] THEN 2 WHEN SUM(node_inds.value) > 0 THEN 1 ELSE 0 END as bucket5')
                       .joins('LEFT JOIN context_layer ON context_layer.layer_attribute_id = node_inds.ind_id and context_layer.layer_attribute_type = \'Ind\'')
                       .where(node_inds: {node_id: node_ids})
                       .where('node_inds.year IN (:years) OR node_inds.year IS NULL', {:years => (start_year..end_year).to_a})
                       .where('context_layer.context_id = :context_id', {:context_id => @context.id})
                       .where('context_id = :context_id', {:context_id => @context.id})
                       .where('context_layer.enabled = TRUE')
                       .where('context_layer.years IS NULL OR context_layer.years && ARRAY[:years]', {:years => (start_year..end_year).to_a})
                       .group('node_inds.node_id, node_inds.ind_id, context_layer.bucket_5, context_layer.bucket_3')

        quant_values = NodeQuant
                         .select('node_quants.node_id, node_quants.quant_id AS attribute_id, \'Quant\' AS attribute_type, SUM(node_quants.value) as value')
                         .select('CASE WHEN SUM(node_quants.value) >= context_layer.bucket_3[2] THEN 3 WHEN SUM(node_quants.value) >= context_layer.bucket_3[1] THEN 2 WHEN SUM(node_quants.value) > 0 THEN 1 ELSE 0 END as bucket3')
                         .select('CASE WHEN SUM(node_quants.value) >= context_layer.bucket_5[4] THEN 5 WHEN SUM(node_quants.value) >= context_layer.bucket_5[3] THEN 4 WHEN SUM(node_quants.value) >= context_layer.bucket_5[2] THEN 3 WHEN SUM(node_quants.value) >= context_layer.bucket_5[1] THEN 2 WHEN SUM(node_quants.value) > 0 THEN 1 ELSE 0 END as bucket5')
                         .joins('LEFT JOIN context_layer ON context_layer.layer_attribute_id = node_quants.quant_id and context_layer.layer_attribute_type = \'Quant\'')
                         .where(node_quants: {node_id: node_ids})
                         .where('node_quants.year IN (:years) OR node_quants.year IS NULL', {:years => (start_year..end_year).to_a})
                         .where('context_layer.context_id = :context_id', {:context_id => @context.id})
                         .where('context_id = :context_id', {:context_id => @context.id})
                         .where('context_layer.enabled = TRUE')
                         .where('context_layer.years IS NULL OR context_layer.years && ARRAY[:years]', {:years => (start_year..end_year).to_a})
                         .group('node_quants.node_id, node_quants.quant_id, context_layer.bucket_5, context_layer.bucket_3')

        render json: (ind_values + quant_values)
      end
    end
  end
end
