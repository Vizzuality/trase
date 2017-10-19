class CreateMapAttributes < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :map_attributes do |t|
        t.references :map_attribute_group, null: false, foreign_key: {on_delete: :cascade}
        t.integer :position, null: false
        t.column :bucket_3, 'double precision', array: true, null: false, default: []
        t.column :bucket_5, 'double precision', array: true, null: false, default: []
        t.text :color_scale
        t.integer :years, array: true
        t.boolean :is_disabled, null: false, default: false
        t.boolean :is_default, null: false, default: false
        t.timestamps
      end

      add_index :map_attributes, [:map_attribute_group_id, :position], unique: true

      create_table :map_quants do |t|
        t.references :map_attribute, null: false, foreign_key: {on_delete: :cascade}
        t.references :quant, null: false, foreign_key: {on_delete: :cascade}
        t.timestamps
      end
      add_index :map_quants, [:map_attribute_id, :quant_id], unique: true

      create_table :map_inds do |t|
        t.references :map_attribute, null: false, foreign_key: {on_delete: :cascade}
        t.references :ind, null: false, foreign_key: {on_delete: :cascade}
        t.timestamps
      end
      add_index :map_inds, [:map_attribute_id, :ind_id], unique: true

      create_view :map_attributes_mv, materialized: true
      add_index :map_attributes_mv, :id, unique: true
      add_index :map_attributes_mv, [:map_attribute_group_id, :attribute_id],
        name: 'index_map_attributes_mv_on_map_attribute_group_id_attribute_id'
    end
  end

  def down
    with_search_path('revamp') do
      drop_view :map_attributes_mv, materialized: true
      drop_table :map_quants
      drop_table :map_inds
      drop_table :map_attributes
    end
  end
end
