class AddRoleToContextNodeTypeProperty < ActiveRecord::Migration[5.2]
  def change
    add_column :context_node_type_properties, :role, :string
    reversible do |dir|
      dir.up do
        execute <<~SQL
          ALTER TABLE context_node_type_properties
            ADD CONSTRAINT context_node_type_properties_role_check
              CHECK (role IN ('source', 'exporter', 'importer', 'destination'))
        SQL

        # assign role according to column group
        execute <<~SQL
          UPDATE context_node_type_properties
          SET role = CASE
            WHEN column_group = 0 THEN 'source'
            WHEN column_group = 1 THEN 'exporter'
            WHEN column_group = 2 THEN 'importer'
            WHEN column_group = 3 THEN 'destination'
          END;
        SQL

        # nullify role for selected node types, which don't seem to make sense for dashboards
        execute <<~SQL
          UPDATE context_node_type_properties
          SET role = null
          FROM context_node_types, node_types
          WHERE
          context_node_type_properties.context_node_type_id = context_node_types.id
          AND context_node_types.node_type_id = node_types.id
          AND node_types.name IN (
            'LOGISTICS HUB', 'PORT OF EXPORT', 'PORT OF IMPORT', 'CUSTOMS DEPARTMENT', 'COUNTRY OF PRODUCTION'
          )
        SQL
      end
      dir.down do
        execute <<~SQL
          ALTER TABLE chart_attributes
            DROP CONSTRAINT IF EXISTS context_node_type_properties_role_check
        SQL
      end
    end
  end
end
