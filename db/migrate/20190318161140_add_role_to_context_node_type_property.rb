class AddRoleToContextNodeTypeProperty < ActiveRecord::Migration[5.2]
  def change
    add_column :context_node_type_properties, :role, :string
    execute "ALTER TABLE context_node_type_properties ADD CONSTRAINT context_node_type_properties_role_check CHECK (role IN ('source', 'exporter', 'importer', 'company'))"
  end
end
