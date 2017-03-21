class UpdateMaterializedFlowsToVersion3 < ActiveRecord::Migration
  def up
    drop_view :materialized_flows, materialized: true

    update_view :flow_indicators,
      version: 2,
      revert_to_version: 1,
      materialized: true

    update_view :node_flows,
      version: 2,
      revert_to_version: 1,
      materialized: true

    add_index :node_flows, [:column_group, :flow_id]

    create_view :materialized_flows, version: 3, materialized: true
    add_index :materialized_flows, :exporter_node_id
    add_index :materialized_flows, :importer_node_id
    add_index :materialized_flows, :country_node_id
    add_index :materialized_flows, [:indicator_type, :indicator_id]
  end

  def down
    drop_view :materialized_flows, materialized: true

    update_view :flow_indicators,
      version: 1,
      revert_to_version: 1,
      materialized: true

    update_view :node_flows,
      version: 1,
      revert_to_version: 1,
      materialized: true

      add_index :node_flows, [:node_type, :flow_id]

    create_view :materialized_flows, version: 2, materialized: true
    add_index :materialized_flows, :exporter_node_id
    add_index :materialized_flows, :importer_node_id
    add_index :materialized_flows, :country_node_id
    add_index :materialized_flows, [:indicator_type, :indicator_id]
  end
end
