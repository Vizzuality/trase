class IndexDashboardsCompaniesMvForSortingByName < ActiveRecord::Migration[5.2]
  def up
    # quicker to drop than to update
    if data_source_exists? :dashboards_companies_mv
      drop_view :dashboards_companies_mv, materialized: true
    end
    create_view :dashboards_companies_mv,
      version: 3,
      materialized: true
    redo_indexes
    add_index :dashboards_companies_mv,
      :name,
      name: 'dashboards_companies_mv_name_idx'
  end

  def down
    # quicker to drop than to update
    if data_source_exists? :dashboards_companies_mv
      drop_view :dashboards_companies_mv, materialized: true
    end
    create_view :dashboards_companies_mv,
      version: 2,
      materialized: true
    redo_indexes
  end

  def redo_indexes
    add_index :dashboards_companies_mv,
      :commodity_id,
      name: 'dashboards_companies_mv_commodity_id_idx'
    add_index :dashboards_companies_mv,
      :country_id,
      name: 'dashboards_companies_mv_country_id_idx'
    add_index :dashboards_companies_mv,
      [:id, :name, :node_type],
      name: 'dashboards_companies_mv_group_columns_idx'
    add_index :dashboards_companies_mv,
      :name_tsvector,
      name: 'dashboards_companies_mv_name_tsvector_idx',
      using: :gin
    add_index :dashboards_companies_mv,
      :node_id,
      name: 'dashboards_companies_mv_node_id_idx'
    add_index :dashboards_companies_mv,
      :node_type_id,
      name: 'dashboards_companies_mv_node_type_id_idx'
    add_index :dashboards_companies_mv,
      [:id, :node_id, :country_id, :commodity_id],
      unique: true,
      name: 'dashboards_companies_mv_unique_idx'
  end
end
