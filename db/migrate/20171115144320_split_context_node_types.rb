class SplitContextNodeTypes < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :context_node_type_properties do |t|
        t.references :context_node_type, null: false, foreign_key: {on_delete: :cascade}
        t.integer :column_group, null: false
        t.integer :column_position, null: false
        t.boolean :is_default, null: false, default: false
        t.boolean :is_geo_column, null: false, default: false
        t.timestamps
      end

      execute 'ALTER TABLE context_node_type_properties ADD CONSTRAINT context_node_type_properties_context_node_type_id_key UNIQUE (context_node_type_id)'

      remove_column :context_node_types, :column_group
      remove_column :context_node_types, :column_position
      remove_column :context_node_types, :is_default
      remove_column :context_node_types, :is_geo_column
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :context_node_type_properties
      add_column :context_node_types, :column_group, null: false
      add_column :context_node_types, :column_position, null: false
      add_column :context_node_types, :is_default, null: false, default: false
      add_column :context_node_types, :is_geo_column, null: false, default: false
    end
  end
end
