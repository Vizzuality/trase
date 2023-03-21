class AddColumnsToDownloadAttributesMv < ActiveRecord::Migration[5.2]
  def change
    remove_index :download_attributes_mv, [:context_id, :attribute_id]
    update_view :download_attributes_mv,
      version: 3,
      revert_to_version: 2,
      materialized: true
    add_index :download_attributes_mv, [:context_id, :original_type, :original_id],
      name: 'download_attributes_mv_context_id_original_type_original_id_idx'
  end
end
