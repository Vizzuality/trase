class CreateNodesWithFlowsOrGeo < ActiveRecord::Migration[5.2]
  def up
    create_view :nodes_with_flows_or_geo_v, materialized: false
    create_table :nodes_with_flows_or_geo, primary_key: %i[id context_id] do |t|
      t.integer :id
      t.integer :context_id
      t.integer :node_type_id
      t.integer :main_id
      t.boolean :is_unknown
      t.boolean :is_domestic_consumption
      t.boolean :is_aggregated
      t.boolean :has_flows
      t.text :name
      t.text :node_type
      t.text :geo_id
      t.text :profile
    end

    Api::V3::Readonly::NodeWithFlowsOrGeo.refresh(
      sync: (Rails.env.development? || Rails.env.test?)
    )

    drop_view :sankey_nodes_mv, materialized: true
  end

  def down
    drop_table :nodes_with_flows_or_geo
    drop_view :nodes_with_flows_or_geo_v, materialized: false
    create_view :sankey_nodes_mv, materialized: true
    add_index :sankey_nodes_mv, [:context_id, :id], unique: true,
      name: :sankey_nodes_mv_context_id_id_idx
    add_index :sankey_nodes_mv, [:node_type_id],
      name: :sankey_nodes_mv_node_type_id_idx
  end
end
