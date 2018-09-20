class CreateDashboardsCommoditiesMv < ActiveRecord::Migration[5.1]
  def change
    create_view :dashboards_commodities_mv, materialized: true
    add_index :dashboards_commodities_mv, :flow_id, unique: true
    add_index :dashboards_commodities_mv, [:id, :name]
  end
end
