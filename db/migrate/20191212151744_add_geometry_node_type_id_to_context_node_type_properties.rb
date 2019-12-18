class AddGeometryNodeTypeIdToContextNodeTypeProperties < ActiveRecord::Migration[5.2]
  def change
    add_column :context_node_type_properties,
      :geometry_context_node_type_id,
      :integer
    add_foreign_key :context_node_type_properties,
      :context_node_types,
      column: :geometry_context_node_type_id
  end
end
