class AddMoreNodeTypesAsDestinationToDashboardsFlowPathsMv < ActiveRecord::Migration[5.1]
  def change
    # no-op
    # drop_view :dashboards_companies_mv, materialized: true
    # drop_view :dashboards_destinations_mv, materialized: true
    # drop_view :dashboards_countries_mv, materialized: true
    # drop_view :dashboards_commodities_mv, materialized: true
    # drop_view :dashboards_sources_mv, materialized: true

    update_view :dashboards_flow_paths_mv,
                version: 2,
                revert_to_version: 1,
                materialized: true

    create_view :dashboards_companies_mv,
                version: 2,
                materialized: true
    create_view :dashboards_destinations_mv,
                version: 2,
                materialized: true
    create_view :dashboards_countries_mv,
                version: 2,
                materialized: true
    create_view :dashboards_commodities_mv,
                version: 2,
                materialized: true
    create_view :dashboards_sources_mv,
                version: 2,
                materialized: true

    add_index :dashboards_sources_mv, :country_id, name: 'dashboards_sources_mv_country_id_idx'
    add_index :dashboards_sources_mv, :commodity_id, name: 'dashboards_sources_mv_commodity_id_idx'
    add_index :dashboards_sources_mv, :node_id, name: 'dashboards_sources_mv_node_id_idx'
    add_index :dashboards_sources_mv, :node_type_id, name: 'dashboards_sources_mv_node_type_id_idx'
    add_index :dashboards_sources_mv,
              [:id, :node_id, :country_id, :commodity_id],
              unique: true,
              name: 'dashboards_sources_unique_idx'
    add_index :dashboards_sources_mv,
              [:id, :name, :node_type, :parent_name, :parent_node_type],
              name: 'dashboards_sources_mv_group_columns_idx'

    add_index :dashboards_destinations_mv, :country_id, name: 'dashboards_destinations_mv_country_id_idx'
    add_index :dashboards_destinations_mv, :commodity_id, name: 'dashboards_destinations_mv_commodity_id_idx'
    add_index :dashboards_destinations_mv, :node_id, name: 'dashboards_destinations_mv_node_id_idx'
    add_index :dashboards_destinations_mv, :node_type_id, name: 'dashboards_destinations_mv_node_type_id_idx'
    add_index :dashboards_destinations_mv,
              [:id, :node_id, :country_id, :commodity_id],
              unique: true,
              name: 'dashboards_destinations_mv_unique_idx'
    add_index :dashboards_destinations_mv,
              [:id, :name, :node_type],
              name: 'dashboards_destinations_mv_group_columns_idx'

    add_index :dashboards_companies_mv, :country_id, name: 'dashboards_companies_mv_country_id_idx'
    add_index :dashboards_companies_mv, :commodity_id, name: 'dashboards_companies_mv_commodity_id_idx'
    add_index :dashboards_companies_mv, :node_id, name: 'dashboards_companies_mv_node_id_idx'
    add_index :dashboards_companies_mv, :node_type_id, name: 'dashboards_companies_mv_node_type_id_idx'
    add_index :dashboards_companies_mv,
              [:id, :node_id, :country_id, :commodity_id],
              unique: true,
              name: 'dashboards_companies_mv_unique_idx'
    add_index :dashboards_companies_mv,
              [:id, :name, :node_type],
              name: 'dashboards_companies_mv_group_columns_idx'

    add_index :dashboards_countries_mv, :commodity_id, name: 'dashboards_countries_mv_commodity_id_idx'
    add_index :dashboards_countries_mv, :node_id, name: 'dashboards_countries_mv_node_id_idx'
    add_index :dashboards_countries_mv,
              [:id, :node_id, :commodity_id],
              unique: true,
              name: 'dashboards_countries_mv_unique_idx'
    add_index :dashboards_countries_mv,
              [:id, :name],
              name: 'dashboards_countries_mv_group_columns_idx'

    add_index :dashboards_commodities_mv, :country_id, name: 'dashboards_commodities_mv_country_id_idx'
    add_index :dashboards_commodities_mv, :node_id, name: 'dashboards_commodities_mv_node_id_idx'
    add_index :dashboards_commodities_mv,
              [:id, :node_id, :country_id],
              unique: true,
              name: 'dashboards_commodities_mv_unique_idx'
    add_index :dashboards_commodities_mv,
              [:id, :name],
              name: 'dashboards_commodities_mv_group_columns_idx'

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
