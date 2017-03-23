class UpdateMaterializedFlowsToVersion2 < ActiveRecord::Migration
  def up
    drop_view :materialized_flows, materialized: true if table_exists?(:materialized_flows)
    create_view :materialized_flows, materialized: true, version: 2, revert_to_version: 1
    add_index :materialized_flows, :exporter_node_id
    add_index :materialized_flows, :importer_node_id
    add_index :materialized_flows, :country_node_id
    add_index :materialized_flows, [:indicator_type, :indicator_id]
  end

  def down
    drop_view :materialized_flows, materialized: true
    create_view :materialized_flows, materialized: true, version: 1
    add_index :materialized_flows, :exporter_node_id
    add_index :materialized_flows, :importer_node_id
    add_index :materialized_flows, :country_node_id
    add_index :materialized_flows, :quant_id
  end
end
