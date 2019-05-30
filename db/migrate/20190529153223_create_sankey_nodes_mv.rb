class CreateSankeyNodesMv < ActiveRecord::Migration[5.2]
  def up
    create_view :sankey_nodes_mv, version: 1, materialized: true

    add_index :sankey_nodes_mv, [:context_id, :id], unique: true,
      name: :sankey_nodes_mv_context_id_id_idx
    add_index :sankey_nodes_mv, [:node_type_id],
      name: :sankey_nodes_mv_node_type_id_idx
  end

  def down
    drop_view :sankey_nodes_mv, materialized: true
  end
end
