class SpeedUpDashboardsFlowAttributesRefresh < ActiveRecord::Migration[5.1]
  def up
    # drop_view :dashboards_flow_attributes_mv, materialized: true
    create_view :dashboards_flow_attributes_mv, materialized: true, version: 2
  end
end
