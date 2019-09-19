class RemoveParentNodeFromDashboardsSourcesMv < ActiveRecord::Migration[5.2]
  def change
    update_view :dashboards_sources_mv,
      materialized: true,
      version: 7,
      revert_to_version: 6
  end
end
