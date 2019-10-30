class AddRankPerYearToDashboardsMviews < ActiveRecord::Migration[5.2]
  def change
    update_view :dashboards_sources_mv,
      version: 9,
      revert_to_version: 8,
      materialized: true

    update_view :dashboards_exporters_mv,
      version: 2,
      revert_to_version: 1,
      materialized: true

    update_view :dashboards_importers_mv,
      version: 2,
      revert_to_version: 1,
      materialized: true

    update_view :dashboards_destinations_mv,
      version: 8,
      revert_to_version: 7,
      materialized: true
  end
end
