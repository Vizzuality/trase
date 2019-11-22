class CreateFlowNodes < ActiveRecord::Migration[5.2]
  def change
    create_table :flow_nodes, primary_key: %i[flow_id node_id] do |t|
      t.integer :flow_id, null: false
      t.integer :node_id, null: false
      t.integer :context_id, null: false
      t.column :position, 'smallint', null: false
      t.column :year, 'smallint', null: false
    end

    create_view 'flow_nodes_v', materialized: false

    Api::V3::Readonly::FlowNode.refresh(
      sync: (Rails.env.development? || Rails.env.test?)
    )
  end
end
