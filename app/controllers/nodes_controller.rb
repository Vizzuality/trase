class NodesController < ApplicationController
  def get_all_nodes

    flow_nodes = Flow.select('distinct(unnest(path)) as node_id')

    node_type_ids = NodeType
                        .joins(:context_nodes)
                        .select('node_types.node_type_id')

    flow_nodes = flow_nodes.where('flows.context_id = :context_id', context_id: @context.id)
    node_type_ids = node_type_ids.where('context_nodes.context_id = :context_id', context_id: @context.id)

    matching_nodes = Node
                         .select('
                           nodes.node_id, nodes.name, geo_id, nodes.node_type_id as column_id, nodes.is_domestic_consumption, nodes.is_unknown,
                           node_types.node_type as type, context_nodes.profile_type as profile_type,
                           CASE WHEN flow_nodes.node_id IS NOT NULL OR nodes.name = \'OTHER\' THEN true ELSE false END as has_flows
                         ')
                         .joins(:node_type)
                         .joins("LEFT OUTER JOIN (#{flow_nodes.to_sql}) flow_nodes ON flow_nodes.node_id = nodes.node_id")
                         .joins('LEFT JOIN context_nodes ON context_nodes.node_type_id = nodes.node_type_id')
                         .where('flow_nodes.node_id IS NOT NULL OR substring(geo_id from 1 for 2) = :country_code OR nodes.name = \'OTHER\' ', country_code: @context.country.iso2)
                         .where('nodes.node_type_id IN (:node_type_ids)', node_type_ids: node_type_ids)
                         .where('context_nodes.context_id = :context_id', context_id: @context.id)
                         .all()

    render json: matching_nodes, root: 'data', each_serializer: GetAllNodesSerializer
  end

  def get_node_attributes

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
