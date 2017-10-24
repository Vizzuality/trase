class CreateContextNodeTypes < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :context_node_types do |t|
        t.references :context, null: false, foreign_key: {on_delete: :cascade}
        t.references :node_type, null: false, foreign_key: {on_delete: :cascade}
        t.integer :column_group, null: false
        t.integer :column_position, null: false
        t.boolean :is_default, null: false, default: false
        t.boolean :is_geo_column, null: false, default: false
        t.text :profile_type
        t.timestamps
      end
      execute "ALTER TABLE context_node_types ADD CONSTRAINT check_context_node_types_on_profile_type CHECK (profile_type IN ('actor', 'place') )"
      execute 'ALTER TABLE context_node_types ADD CONSTRAINT context_node_types_context_id_node_type_id_key UNIQUE (context_id, node_type_id)'
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :context_node_types
    end
  end
end
