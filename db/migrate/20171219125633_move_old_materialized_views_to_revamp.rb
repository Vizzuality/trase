class MoveOldMaterializedViewsToRevamp < ActiveRecord::Migration[5.1]
  def change
    with_search_path('revamp') do
      create_view :flow_paths_mv, version: 1, materialized: true
      add_index :flow_paths_mv, [:flow_id, :column_position]

      create_view :download_attributes_values_mv, version: 1, materialized: true
      add_index :download_attributes_values_mv, :flow_id

      create_view :download_flows_mv, version: 1, materialized: true
      add_index :download_flows_mv, :exporter_node_id
      add_index :download_flows_mv, :importer_node_id
      add_index :download_flows_mv, :country_node_id
      add_index :download_flows_mv, [:attribute_type, :attribute_id]
    end
  end
end
