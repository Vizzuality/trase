class CreateAttributes < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :quants do |t|
        t.text :name, null: false
        t.text :unit
        t.text :unit_type
        t.boolean :tooltip, null: false, default: false # TODO: do we need this
        t.text :tooltip_text
        t.text :frontend_name
        t.timestamps
      end

      add_index :quants, :name, unique: true

      create_table :inds do |t|
        t.text :name, null: false
        t.text :unit
        t.text :unit_type
        t.boolean :tooltip, null: false, default: false # TODO: do we need this
        t.text :tooltip_text
        t.text :frontend_name
        t.timestamps
      end

      add_index :inds, :name, unique: true

      create_table :quals do |t|
        t.text :name, null: false
        t.boolean :tooltip, null: false, default: false # TODO: do we need this
        t.text :tooltip_text
        t.text :frontend_name
        t.timestamps
      end

      add_index :quals, :name, unique: true

      create_view :attributes_mv, materialized: true

      add_index :attributes_mv, :id, unique: true
      add_index :attributes_mv, :name, unique: true
    end
  end

  def down
    with_search_path('revamp') do
      drop_view :attributes_mv, materialized: true
      drop_table :quants
      drop_table :inds
      drop_table :quals
    end
  end
end
