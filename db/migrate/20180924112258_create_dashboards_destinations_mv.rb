class CreateDashboardsDestinationsMv < ActiveRecord::Migration[5.1]
  def change
    create_view :dashboards_destinations_mv, materialized: true
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
  end
end
