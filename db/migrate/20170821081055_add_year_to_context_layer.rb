class AddYearToContextLayer < ActiveRecord::Migration[5.0]
  def up
    add_column :context_layer, :years, :integer, array: true
    update_sql = <<-SQL
UPDATE context_layer
SET years = (
ARRAY(SELECT DISTINCT year
FROM node_quants
LEFT JOIN nodes ON node_quants.node_id = nodes.node_id
LEFT JOIN context_nodes ON nodes.node_type_id = context_nodes.node_type_id
WHERE context_layer.layer_attribute_id = node_quants.quant_id
AND context_layer.layer_attribute_type = 'Quant'
AND context_nodes.context_id = context_layer.context_id
)
)
WHERE context_layer.layer_attribute_type = 'Quant';

UPDATE context_layer
SET years = (
ARRAY(
    SELECT DISTINCT year
FROM node_inds
LEFT JOIN nodes ON node_inds.node_id = nodes.node_id
LEFT JOIN context_nodes ON nodes.node_type_id = context_nodes.node_type_id
WHERE context_layer.layer_attribute_id = node_inds.ind_id
AND context_layer.layer_attribute_type = 'Ind'
AND context_nodes.context_id = context_layer.context_id
)
)
WHERE context_layer.layer_attribute_type = 'Ind';

UPDATE context_layer
SET years = NULL
WHERE years = '{null}' or years = '{}';
SQL
    execute update_sql
  end

  def down
    remove_column :context_layer, :years
  end
end
