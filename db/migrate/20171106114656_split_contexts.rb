class SplitContexts < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :context_properties do |t|
        t.references :context, null: false, foreign_key: {on_delete: :cascade}
        t.integer :years, array: true
        t.integer :default_year
        t.text :default_basemap
        t.boolean :is_disabled, null: false, default: false
        t.boolean :is_default, null: false, default: false
        t.timestamps
      end
      execute 'ALTER TABLE context_properties ADD CONSTRAINT context_properties_context_id_key UNIQUE (context_id)'
      remove_column :contexts, :years
      remove_column :contexts, :default_year
      remove_column :contexts, :default_basemap
      remove_column :contexts, :is_disabled
      remove_column :contexts, :is_default
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :context_properties
      add_column :contexts, :years, :integer, array: true
      add_column :contexts, :default_year, :integer
      add_column :contexts, :default_basemap, :text
      add_column :contexts, :is_disabled, :boolean, null: false, default: false
      add_column :contexts, :is_default, :boolean, null: false, default: false
    end
  end
end
