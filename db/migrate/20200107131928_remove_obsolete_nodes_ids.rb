class RemoveObsoleteNodesIds < ActiveRecord::Migration[5.2]
  def up
    [
      Api::V3::Readonly::Dashboards::Source,
      Api::V3::Readonly::Dashboards::Exporter,
      Api::V3::Readonly::Dashboards::Importer,
      Api::V3::Readonly::Dashboards::Company,
      Api::V3::Readonly::Dashboards::Destination
    ].each do |klass|
      table_name = klass.table_name
      remove_column table_name, :nodes_ids
      update_view :"#{table_name}_v", materialized: false, version: 3, revert_to_version: 2
    end

    remove_column :nodes_with_flows_per_year, :nodes_ids
    update_view :nodes_with_flows_per_year_v, materialized: false, version: 3, revert_to_version: 2
  end

  def down
    add_column :nodes_with_flows_per_year, :nodes_ids, 'int[]'
    update_view :nodes_with_flows_per_year_v, materialized: false, version: 2, revert_to_version: 3
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(
      sync: (Rails.env.development? || Rails.env.test?)
    )

    [
      Api::V3::Readonly::Dashboards::Source,
      Api::V3::Readonly::Dashboards::Exporter,
      Api::V3::Readonly::Dashboards::Importer,
      Api::V3::Readonly::Dashboards::Company,
      Api::V3::Readonly::Dashboards::Destination
    ].each do |klass|
      table_name = klass.table_name
      add_column table_name, :nodes_ids, 'int[]'
      update_view :"#{table_name}_v", materialized: false, version: 2, revert_to_version: 3
      klass.refresh(
        sync: (Rails.env.development? || Rails.env.test?)
      )
    end
  end
end
