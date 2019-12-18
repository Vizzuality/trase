class CreateDashboardsCommoditiesAndCountries < ActiveRecord::Migration[5.2]
  def up
    create_table :dashboards_commodities, primary_key: %i[id node_id country_id] do |t|
      t.integer :id
      t.integer :country_id
      t.integer :node_id
      t.text :name
      t.column :name_tsvector, 'tsvector'
      t.text :profile
    end

    create_table :dashboards_countries, primary_key: %i[id node_id commodity_id] do |t|
      t.integer :id
      t.integer :commodity_id
      t.integer :node_id
      t.text :iso2
      t.text :name
      t.column :name_tsvector, 'tsvector'
      t.text :profile
    end

    create_view :dashboards_commodities_v, materialized: false
    create_view :dashboards_countries_v, materialized: false

    Api::V3::Readonly::Dashboards::Commodity.refresh(
      sync: (Rails.env.development? || Rails.env.test?)
    )
    Api::V3::Readonly::Dashboards::Country.refresh(
      sync: (Rails.env.development? || Rails.env.test?)
    )

    drop_view :dashboards_commodities_mv, materialized: true
    drop_view :dashboards_countries_mv, materialized: true
  end

  def down
    create_view :dashboards_commodities_mv, version: 5, materialized: true
    create_view :dashboards_countries_mv, version: 5, materialized: true

    redo_dashboards_commodities_indexes
    redo_dashboards_countries_indexes

    drop_table :dashboards_commodities
    drop_table :dashboards_countries

    drop_view :dashboards_commodities_v, materialized: false
    drop_view :dashboards_countries_v, materialized: false
  end

  def redo_dashboards_countries_indexes
    add_index :dashboards_countries_mv,
      :commodity_id,
      name: 'dashboards_countries_mv_commodity_id_idx'
    add_index :dashboards_countries_mv,
      [:id, :name],
      name: 'dashboards_countries_mv_group_columns_idx'
    add_index :dashboards_countries_mv,
      :name_tsvector,
      name: 'dashboards_countries_mv_name_tsvector_idx',
      using: :gin
    add_index :dashboards_countries_mv,
      :node_id,
      name: 'dashboards_countries_mv_node_id_idx'
    add_index :dashboards_countries_mv,
      [:id, :node_id, :commodity_id],
      unique: true,
      name: 'dashboards_countries_mv_unique_idx'
    add_index :dashboards_countries_mv,
      :name,
      name: 'dashboards_countries_mv_name_idx'
  end

  def redo_dashboards_commodities_indexes
    add_index :dashboards_commodities_mv,
      :country_id,
      name: 'dashboards_commodities_mv_country_id_idx'
    add_index :dashboards_commodities_mv,
      [:id, :name],
      name: 'dashboards_commodities_mv_group_columns_idx'
    add_index :dashboards_commodities_mv,
      :name_tsvector,
      name: 'dashboards_commodities_mv_name_tsvector_idx',
      using: :gin
    add_index :dashboards_commodities_mv,
      :node_id,
      name: 'dashboards_commodities_mv_node_id_idx'
    add_index :dashboards_commodities_mv,
      [:id, :node_id, :country_id],
      unique: true,
      name: 'dashboards_commodities_mv_unique_idx'
    add_index :dashboards_commodities_mv,
      :name,
      name: 'dashboards_commodities_mv_name_idx'
  end
end
