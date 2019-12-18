class AddYearToCountriesAndCommodities < ActiveRecord::Migration[5.2]
  def up
    drop_table :dashboards_commodities
    drop_table :dashboards_countries

    update_view :dashboards_commodities_v, version: 3, revert_to_version: 2, materialized: false
    update_view :dashboards_countries_v, version: 3, revert_to_version: 2, materialized: false

    create_table :dashboards_commodities, primary_key: %i[id node_id country_id year] do |t|
      t.integer :id
      t.integer :country_id
      t.integer :node_id
      t.column :year, 'smallint'
      t.text :name
      t.column :name_tsvector, 'tsvector'
      t.text :profile
    end

    create_table :dashboards_countries, primary_key: %i[id node_id commodity_id year] do |t|
      t.integer :id
      t.integer :commodity_id
      t.integer :node_id
      t.column :year, 'smallint'
      t.text :iso2
      t.text :name
      t.column :name_tsvector, 'tsvector'
      t.text :profile
    end

    Api::V3::Readonly::Dashboards::Commodity.refresh(
      sync: (Rails.env.development? || Rails.env.test?)
    )
    Api::V3::Readonly::Dashboards::Country.refresh(
      sync: (Rails.env.development? || Rails.env.test?)
    )
  end

  def down
    remove_column :dashboards_commodities, :year
    remove_column :dashboards_countries, :year

    update_view :dashboards_commodities_v, version: 2, revert_to_version: 1, materialized: false
    update_view :dashboards_countries_v, version: 2, revert_to_version: 1, materialized: false

    Api::V3::Readonly::Dashboards::Commodity.refresh(
      sync: (Rails.env.development? || Rails.env.test?)
    )
    Api::V3::Readonly::Dashboards::Country.refresh(
      sync: (Rails.env.development? || Rails.env.test?)
    )
  end
end
