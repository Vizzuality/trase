class RemoveChartTypeFromDashboardsAttributes < ActiveRecord::Migration[5.2]
  def change
    update_view :dashboards_attributes_mv,
      materialized: true,
      version: 2,
      revert_to_version: 1
    remove_column :dashboards_attributes, :chart_type
  end
end
