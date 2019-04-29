class RemoveOldDashboardsMviews < ActiveRecord::Migration[5.2]
  def change
    drop_view :dashboards_flow_attributes_mv, materialized: true
    drop_view :dashboards_node_attributes_mv, materialized: true
  end
end
