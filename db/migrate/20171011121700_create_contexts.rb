class CreateContexts < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :contexts do |t|
        t.integer :years, array: true, default: []
        t.references :country, null: false, foreign_key: {on_delete: :cascade}
        t.references :commodity, null: false, foreign_key: {on_delete: :cascade}
        t.integer :default_year
        t.text :default_context_layers, array: true, default: []
        t.text :default_basemap
        t.boolean :is_disabled, null: false, default: false
        t.boolean :is_default, null: false, default: false
        t.timestamps
      end

      add_index :contexts, [:country_id, :commodity_id], unique: true
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :contexts
    end
  end
end
