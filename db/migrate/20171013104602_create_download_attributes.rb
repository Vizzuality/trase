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
      execute 'ALTER TABLE download_attributes ADD CONSTRAINT download_attributes_context_id_position_key UNIQUE (context_id, position)'

      create_table :download_quants do |t|
        t.references :download_attribute, null: false, foreign_key: {on_delete: :cascade}
        t.references :quant, null: false, foreign_key: {on_delete: :cascade}
        t.boolean :is_filter_enabled, null: false, default: false
        t.column :filter_bands, 'double precision', array: true
        t.timestamps
      end
      execute 'ALTER TABLE download_quants ADD CONSTRAINT download_quants_download_attribute_id_quant_id_key UNIQUE (download_attribute_id, quant_id)'

      create_table :download_quals do |t|
        t.references :download_attribute, null: false, foreign_key: {on_delete: :cascade}
        t.references :qual, null: false, foreign_key: {on_delete: :cascade}
        t.boolean :is_filter_enabled, null: false, default: false
        t.timestamps
      end
      execute 'ALTER TABLE download_quals ADD CONSTRAINT download_quals_download_attribute_id_qual_id_key UNIQUE (download_attribute_id, qual_id)'

      create_view :download_attributes_mv, materialized: true
      add_index :download_attributes_mv, :id, unique: true,
        name: 'download_attributes_mv_id_idx'
      add_index :download_attributes_mv, [:context_id, :attribute_id],
        name: 'download_attributes_mv_context_id_attribute_id_idx'
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
