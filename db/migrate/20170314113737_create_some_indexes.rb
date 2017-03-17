class CreateSomeIndexes < ActiveRecord::Migration[5.0]
  def change
    add_index :flow_inds, :ind_id
    add_index :flow_quants, :quant_id
    add_index :flow_quals, :qual_id
    add_index :nodes, :node_type_id
  end
end
