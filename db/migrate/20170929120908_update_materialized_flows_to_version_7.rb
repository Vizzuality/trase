class UpdateMaterializedFlowsToVersion7 < ActiveRecord::Migration
  def up
    drop_view :materialized_flows, materialized: true

    update_view :node_flows,
      version: 5,
      revert_to_version: 4,
      materialized: true


    create_view :materialized_flows, version: 7, materialized: true
    add_index :materialized_flows, :exporter_node_id
    add_index :materialized_flows, :importer_node_id
    add_index :materialized_flows, :country_node_id
    add_index :materialized_flows, [:indicator_type, :indicator_id]
  end

  def down
    drop_view :materialized_flows, materialized: true

    update_view :node_flows,
      version: 4,
      revert_to_version: 3,
      materialized: true

    create_view :materialized_flows, version: 6, materialized: true
    add_index :materialized_flows, :exporter_node_id
    add_index :materialized_flows, :importer_node_id
    add_index :materialized_flows, :country_node_id
    add_index :materialized_flows, [:indicator_type, :indicator_id]
  end
end