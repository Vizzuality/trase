class CreateDashboardsFlowPathsMv < ActiveRecord::Migration[5.1]
  def change
    create_view :dashboards_flow_paths_mv, materialized: true
    add_index :dashboards_flow_paths_mv, :country_id
    add_index :dashboards_flow_paths_mv, :commodity_id
    add_index :dashboards_flow_paths_mv, :node_id
    add_index :dashboards_flow_paths_mv, :flow_id
    add_index :dashboards_flow_paths_mv, [:flow_id, :node_id], unique: true
  end
end
