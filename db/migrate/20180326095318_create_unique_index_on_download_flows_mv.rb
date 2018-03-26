class CreateUniqueIndexOnDownloadFlowsMv < ActiveRecord::Migration[5.1]
  def change
    remove_index :download_flows_mv,
      [:attribute_type, :attribute_id]
    add_index :download_flows_mv,
      [:attribute_type, :attribute_id, :id],
      unique: true,
      name: 'download_flows_mv_attribute_type_attribute_id_id_idx'
  end
end
