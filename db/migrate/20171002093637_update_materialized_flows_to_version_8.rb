class UpdateMaterializedFlowsToVersion8 < ActiveRecord::Migration
  def change
    remove_index :node_flows, [:column_group, :flow_id]
    add_index :node_flows, [:flow_id, :column_position]
    update_view :materialized_flows,
      version: 8,
      revert_to_version: 7,
      materialized: true
  end
end
