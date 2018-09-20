class CreateDashboardsCompaniesMv < ActiveRecord::Migration[5.1]
  def change
    create_view :dashboards_companies_mv, materialized: true
    add_index :dashboards_companies_mv, :flow_id
    add_index :dashboards_companies_mv, [:flow_id, :id], unique: true
    add_index :dashboards_companies_mv, [:id, :name, :node_type]
  end
end
