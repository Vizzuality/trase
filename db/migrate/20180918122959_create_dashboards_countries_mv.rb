class CreateDashboardsCountriesMv < ActiveRecord::Migration[5.1]
  def change
    create_view :dashboards_countries_mv, materialized: true
    add_index :dashboards_countries_mv, :flow_id, unique: true
    add_index :dashboards_countries_mv, [:id, :name]
  end
end
