class CreateDashboardsSourcesMv < ActiveRecord::Migration[5.1]
  def change
    create_view :dashboards_sources_mv, materialized: true
    add_index :dashboards_sources_mv, :flow_id
    add_index :dashboards_sources_mv, [:flow_id, :id], unique: true
    add_index :dashboards_sources_mv, [:id, :name, :node_type]
  end
end
