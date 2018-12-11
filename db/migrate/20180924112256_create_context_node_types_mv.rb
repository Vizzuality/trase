class CreateContextNodeTypesMv < ActiveRecord::Migration[5.1]
  def change
    create_view :context_node_types_mv, materialized: true
    add_index :context_node_types_mv, [:context_id, :node_type_id],
      unique: true,
      name: 'context_node_types_mv_context_id_node_type_id_idx'
  end
end
