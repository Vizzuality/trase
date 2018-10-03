class CreateDashboardsTsvectorColumns < ActiveRecord::Migration[5.1]
  def change
    update_view :dashboards_sources_mv,
            version: 2,
            revert_to_version: 1,
            materialized: true
    update_view :dashboards_companies_mv,
            version: 2,
            revert_to_version: 1,
            materialized: true
    update_view :dashboards_destinations_mv,
            version: 2,
            revert_to_version: 1,
            materialized: true
    update_view :dashboards_countries_mv,
            version: 2,
            revert_to_version: 1,
            materialized: true
    update_view :dashboards_commodities_mv,
            version: 2,
            revert_to_version: 1,
            materialized: true
    add_index :dashboards_sources_mv,
      :name_tsvector,
      name: 'dashboards_sources_mv_name_tsvector_idx',
      using: :gin
    add_index :dashboards_companies_mv,
      :name_tsvector,
      name: 'dashboards_companies_mv_name_tsvector_idx',
      using: :gin
    add_index :dashboards_destinations_mv,
      :name_tsvector,
      name: 'dashboards_destinations_mv_name_tsvector_idx',
      using: :gin
    add_index :dashboards_countries_mv,
      :name_tsvector,
      name: 'dashboards_countries_mv_name_tsvector_idx',
      using: :gin
    add_index :dashboards_commodities_mv,
      :name_tsvector,
      name: 'dashboards_commodities_mv_name_tsvector_idx',
      using: :gin
  end
end
