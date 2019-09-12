class ReplaceDashboardsFlowPathsWithFlowNodes < ActiveRecord::Migration[5.2]
  def change
    create_view :flow_nodes_mv,
      materialized: true,
      version: 1

    add_index :flow_nodes_mv,
      [:flow_id, :node_id],
      unique: true,
      name: 'flow_nodes_mv_flow_id_node_id_idx'

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
