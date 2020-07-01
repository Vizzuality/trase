class FixGeometryContextNodeTypeIdFk < ActiveRecord::Migration[5.2]
  def change
    remove_foreign_key :context_node_type_properties,
      column: :geometry_context_node_type_id
    add_foreign_key :context_node_type_properties,
      :context_node_types,
      column: :geometry_context_node_type_id, on_delete: :nullify
  end
end
