class CreateNodeFlows < ActiveRecord::Migration[5.0]
  def change
    create_view :node_flows, materialized: true
    add_index :node_flows, [:node_type, :flow_id]
  end
end
