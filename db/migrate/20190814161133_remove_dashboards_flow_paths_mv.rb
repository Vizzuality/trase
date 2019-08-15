class RemoveDashboardsFlowPathsMv < ActiveRecord::Migration[5.2]
  def change
    update_view :dashboards_sources_mv,
      materialized: true,
      version: 6,
      revert_to_version: 5
    update_view :dashboards_companies_mv,
      materialized: true,
      version: 6,
      revert_to_version: 5
    update_view :dashboards_destinations_mv,
      materialized: true,
      version: 6,
      revert_to_version: 5
    update_view :dashboards_countries_mv,
      materialized: true,
      version: 5,
      revert_to_version: 4
    update_view :dashboards_commodities_mv,
      materialized: true,
      version: 5,
      revert_to_version: 4
    drop_view :dashboards_flow_paths_mv, materialized: true
    drop_view :context_node_types_mv, materialized: true
  end
end
