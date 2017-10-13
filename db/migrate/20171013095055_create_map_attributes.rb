class CreateMapAttributes < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :map_attributes do |t|
        t.references :map_attribute_group, null: false, foreign_key: {on_delete: :cascade}
        t.references :attribute, null: false, foreign_key: {on_delete: :cascade}
        t.integer :position, null: false
        t.column :bucket_3, 'double precision', array: true, null: false, default: []
        t.column :bucket_5, 'double precision', array: true, null: false, default: []
        t.text :color_scale
        t.integer :years, array: true
        t.text :aggregate_method
        t.boolean :is_disabled, null: false, default: false
        t.boolean :is_default, null: false, default: false
        t.timestamps
      end

      add_index :map_attributes, [:map_attribute_group_id, :position], unique: true
    end
  end

  def down
    with_search_path('revamp') do
      drop_table :map_attributes
    end
  end
end
