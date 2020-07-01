class AddIsVisibleToContextNodeTypeProperties < ActiveRecord::Migration[5.2]
  def change
    add_column :context_node_type_properties, :is_visible, :boolean
    execute 'UPDATE context_node_type_properties SET is_visible = TRUE'
    change_column :context_node_type_properties, :is_visible, :boolean, null: false, default: true
  end
end
