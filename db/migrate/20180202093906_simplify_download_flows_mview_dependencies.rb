class SimplifyDownloadFlowsMviewDependencies < ActiveRecord::Migration[5.1]
  def change
    with_search_path('revamp') do
      drop_view :download_flows_mv, materialized: true
      # we'll be merging download_attributes_valus_mv into download_flows_mv
      drop_view :download_attributes_values_mv, materialized: true
      drop_view :flow_paths_mv, materialized: true

      # flow_paths_mv now without dependency on context_node_type_properties
      create_view :flow_paths_mv, version: 2, materialized: true
      add_index :flow_paths_mv, [:flow_id, :column_position]

      create_view :download_flows_mv, version: 2, materialized: true
      add_index :download_flows_mv, :exporter_node_id
      add_index :download_flows_mv, :importer_node_id
      add_index :download_flows_mv, :country_node_id
      add_index :download_flows_mv, [:attribute_type, :attribute_id]
    end
  end
end
