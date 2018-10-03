class CreateDashboardsCommoditiesMv < ActiveRecord::Migration[5.1]
  def change
    create_view :dashboards_commodities_mv, materialized: true
    add_index :dashboards_commodities_mv, :country_id, name: 'dashboards_commodities_mv_country_id_idx'
    add_index :dashboards_commodities_mv, :node_id, name: 'dashboards_commodities_mv_node_id_idx'
    add_index :dashboards_commodities_mv,
      [:id, :node_id, :country_id],
      unique: true,
      name: 'dashboards_commodities_mv_unique_idx'
    add_index :dashboards_commodities_mv,
      [:id, :name],
      name: 'dashboards_commodities_mv_group_columns_idx'
  end
end
