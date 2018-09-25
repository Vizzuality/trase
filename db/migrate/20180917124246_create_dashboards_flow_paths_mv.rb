class CreateDashboardsFlowPathsMv < ActiveRecord::Migration[5.1]
  def change
    create_view :dashboards_flow_paths_mv, materialized: true
    add_index :dashboards_flow_paths_mv, [:flow_id, :node_id], unique: true, name: 'dashboards_flow_paths_mv_flow_id_node_id_idx'
    add_index :dashboards_flow_paths_mv, :category, name: 'dashboards_flow_paths_mv_category_idx'
  end
end
