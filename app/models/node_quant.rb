# == Schema Information
#
# Table name: node_quants
#
#  node_id  :integer
#  quant_id :integer
#  year     :integer
#  value    :float
#

class NodeQuant < ActiveRecord::Base
  belongs_to :node, class_name: 'Node', foreign_key: :node_id
  belongs_to :quant, class_name: 'Quant', foreign_key: :quant_id

  def self.get_attributes_for_nodes(node_ids, context_id, start_year, end_year)
    self.select('node_quants.node_id, node_quants.quant_id AS attribute_id, \'Quant\' AS attribute_type, SUM(node_quants.value) as value').
      select('CASE WHEN SUM(node_quants.value) >= context_layer.bucket_3[2] THEN 3 WHEN SUM(node_quants.value) >= context_layer.bucket_3[1] THEN 2 WHEN SUM(node_quants.value) > 0 THEN 1 ELSE 0 END as bucket3').
      select('CASE WHEN SUM(node_quants.value) >= context_layer.bucket_5[4] THEN 5 WHEN SUM(node_quants.value) >= context_layer.bucket_5[3] THEN 4 WHEN SUM(node_quants.value) >= context_layer.bucket_5[2] THEN 3 WHEN SUM(node_quants.value) >= context_layer.bucket_5[1] THEN 2 WHEN SUM(node_quants.value) > 0 THEN 1 ELSE 0 END as bucket5').
      joins('LEFT JOIN context_layer ON context_layer.layer_attribute_id = node_quants.quant_id and context_layer.layer_attribute_type = \'Quant\'').
      where(node_quants: {node_id: node_ids}).
      where('node_quants.year IN (:years) OR node_quants.year IS NULL', years: (start_year..end_year).to_a).
      where('context_layer.context_id = :context_id', context_id: context_id).
      where('context_id = :context_id', context_id: context_id).
      where('context_layer.enabled = TRUE').
      where('context_layer.years IS NULL OR context_layer.years && ARRAY[:years]', years: (start_year..end_year).to_a).
      group('node_quants.node_id, node_quants.quant_id, context_layer.bucket_5, context_layer.bucket_3')
  end
end
