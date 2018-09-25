class CreateDashboardsCountriesMv < ActiveRecord::Migration[5.1]
  def change
    create_view :dashboards_countries_mv, materialized: true
    add_index :dashboards_countries_mv, :commodity_id, name: 'dashboards_countries_mv_commodity_id_idx'
    add_index :dashboards_countries_mv, :node_id, name: 'dashboards_countries_mv_node_id_idx'
    add_index :dashboards_countries_mv,
      [:id, :node_id, :commodity_id],
      unique: true,
      name: 'dashboards_countries_mv_unique_idx'
    add_index :dashboards_countries_mv,
      [:id, :name],
      name: 'dashboards_countries_mv_group_columns_idx'
  end
end
