class CreateDownloadAttributes < ActiveRecord::Migration[5.0]
  include SearchPathHelpers

  def up
    with_search_path('revamp') do
      create_table :download_attributes do |t|
        t.references :context, null: false, foreign_key: {on_delete: :cascade}
        t.integer :position, null: false
        t.text :name_in_download, null: false
        t.integer :years, array: true
        t.timestamps
      end

      add_index :download_attributes, [:context_id, :position], unique: true

      create_table :download_quants do |t|
        t.references :download_attribute, null: false, foreign_key: {on_delete: :cascade}
        t.references :quant, null: false, foreign_key: {on_delete: :cascade}
        t.timestamps
      end

      add_index :download_quants, [:download_attribute_id, :quant_id], unique: true

      create_table :download_quals do |t|
        t.references :download_attribute, null: false, foreign_key: {on_delete: :cascade}
        t.references :qual, null: false, foreign_key: {on_delete: :cascade}
        t.timestamps
      end

      add_index :download_quals, [:download_attribute_id, :qual_id], unique: true

      create_view :download_attributes_mv, materialized: true
      add_index :download_attributes_mv, :id, unique: true
      add_index :download_attributes_mv, [:context_id, :attribute_id]
    end
  end

  def down
    with_search_path('revamp') do
      drop_view :download_attributes_mv, materialized: true
      drop_table :download_quants
      drop_table :download_quals
      drop_table :download_attributes
    end
  end
end
