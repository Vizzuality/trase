class AddRowNameToDownloadFlowsMv < ActiveRecord::Migration[5.1]
  def up
    drop_view :download_flows_mv, materialized: true
    create_view :download_flows_mv, version: 3, materialized: true

    add_index :download_flows_mv, :context_id,
      name: 'download_flows_mv_context_id_idx'
    add_index :download_flows_mv, :exporter_node_id,
      name: 'download_flows_mv_exporter_node_id_idx'
    add_index :download_flows_mv, :importer_node_id,
      name: 'download_flows_mv_importer_node_id_idx'
    add_index :download_flows_mv, :country_node_id,
      name: 'download_flows_mv_country_node_id_idx'
    add_index :download_flows_mv,
      [:attribute_type, :attribute_id, :id],
      unique: true,
      name: 'download_flows_mv_attribute_type_attribute_id_id_idx'
    add_index :download_flows_mv,
      [:row_name, :attribute_type, :attribute_id],
      unique: true,
      name: 'download_flows_mv_row_name_attribute_type_attribute_id_idx'
  end

  def down
    drop_view :download_flows_mv, materialized: true
    create_view :download_flows_mv, version: 2, materialized: true

    add_index :download_flows_mv, :context_id,
      name: 'download_flows_mv_context_id_idx'
    add_index :download_flows_mv, :exporter_node_id
    add_index :download_flows_mv, :importer_node_id
    add_index :download_flows_mv, :country_node_id
    add_index :download_flows_mv,
      [:attribute_type, :attribute_id, :id],
      unique: true,
      name: 'download_flows_mv_attribute_type_attribute_id_id_idx'
  end
end
