class CreateDashboardsSourcesMv < ActiveRecord::Migration[5.1]
  def change
    create_view :dashboards_sources_mv, materialized: true
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
  end
end
