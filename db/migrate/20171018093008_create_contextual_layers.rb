class CreateContextualLayers < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :contextual_layers do |t|
        t.references :context, null: false, foreign_key: {on_delete: :cascade}
        t.text :title, null: false
        t.text :identifier, null: false
        t.integer :position, null: false
        t.text :tooltip_text
        t.boolean :is_default, null: false, default: false
        t.timestamps
      end

      add_index :contextual_layers, [:context_id, :position], unique: true
      add_index :contextual_layers, [:context_id, :identifier], unique: true

      create_table :carto_layers do |t|
        t.references :contextual_layer, null: false, foreign_key: {on_delete: :cascade}
        t.text :identifier, null: false
        t.integer :years, array: true
        t.timestamps
      end
      
      add_index :carto_layers, [:contextual_layer_id, :identifier], unique: true
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :carto_layers
      drop_table :contextual_layers
    end
  end
end
