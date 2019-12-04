class AddColumnsToNodesWithFlowsPerYear < ActiveRecord::Migration[5.2]
  def up
    drop_view :dashboards_sources_v, materialized: false
    drop_view :dashboards_exporters_v, materialized: false
    drop_view :dashboards_importers_v, materialized: false
    drop_view :dashboards_companies_v, materialized: false
    drop_view :dashboards_destinations_v, materialized: false
    drop_view :dashboards_commodities_v, materialized: false
    drop_view :dashboards_countries_v, materialized: false

    drop_table :nodes_with_flows_per_year
    create_table :nodes_with_flows_per_year, primary_key: %i[id context_id year] do |t|
      t.integer :id
      t.integer :context_id
      t.integer :country_id
      t.integer :commodity_id
      t.integer :node_type_id
      t.integer :context_node_type_id
      t.integer :main_id
      t.column :column_position, 'smallint'
      t.column :year, 'smallint'
      t.boolean :is_unknown
      t.column :nodes_ids, 'int[]'
      t.text :name
      t.column :name_tsvector, 'tsvector'
      t.text :node_type
      t.text :geo_id
    end

    update_view :nodes_with_flows_per_year_v,
      version: 2,
      revert_to_version: 1,
      materialized: false
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(
      sync: (Rails.env.development? || Rails.env.test?)
    )

    create_view :dashboards_sources_v, version: 2, materialized: false
    create_view :dashboards_exporters_v, version: 2, materialized: false
    create_view :dashboards_importers_v, version: 2, materialized: false
    create_view :dashboards_companies_v, version: 2, materialized: false
    create_view :dashboards_destinations_v, version: 2, materialized: false
    create_view :dashboards_commodities_v, version: 2, materialized: false
    create_view :dashboards_countries_v, version: 2, materialized: false
  end

  def down
    drop_view :dashboards_sources_v, materialized: false
    drop_view :dashboards_exporters_v, materialized: false
    drop_view :dashboards_importers_v, materialized: false
    drop_view :dashboards_companies_v, materialized: false
    drop_view :dashboards_destinations_v, materialized: false
    drop_view :dashboards_commodities_v, materialized: false
    drop_view :dashboards_countries_v, materialized: false

    rename_column :nodes_with_flows_per_year, :id, :node_id
    remove_column :nodes_with_flows_per_year, :main_id
    remove_column :nodes_with_flows_per_year, :column_position

    create_view :dashboards_sources_v, version: 1, materialized: false
    create_view :dashboards_exporters_v, version: 1, materialized: false
    create_view :dashboards_importers_v, version: 1, materialized: false
    create_view :dashboards_companies_v, version: 1, materialized: false
    create_view :dashboards_destinations_v, version: 1, materialized: false
    create_view :dashboards_commodities_v, version: 1, materialized: false
    create_view :dashboards_countries_v, version: 1, materialized: false
  end
end
