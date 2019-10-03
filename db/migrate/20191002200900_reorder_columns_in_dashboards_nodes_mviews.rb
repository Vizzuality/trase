class ReorderColumnsInDashboardsNodesMviews < ActiveRecord::Migration[5.2]
  def up
    # drop unnecessary indexes
    remove_index :dashboards_sources_mv,
                 column: [:name]
    remove_index :dashboards_companies_mv,
                 column: [:name]
    remove_index :dashboards_destinations_mv,
                 column: [:name]
    remove_index :dashboards_companies_mv,
               column: [:id, :name, :node_type]
    remove_index :dashboards_destinations_mv,
               column: [:id, :name, :node_type]

    # reorder columns to reduce padding
    update_view :dashboards_sources_mv,
      version: 8,
      revert_to_version: 7,
      materialized: true
    update_view :dashboards_companies_mv,
      version: 7,
      revert_to_version: 6,
      materialized: true
    update_view :dashboards_destinations_mv,
      version: 7,
      revert_to_version: 6,
      materialized: true
  end

  def down
    update_view :dashboards_sources_mv,
      version: 7,
      revert_to_version: 6,
      materialized: true
    update_view :dashboards_companies_mv,
      version: 6,
      revert_to_version: 5,
      materialized: true
    update_view :dashboards_destinations_mv,
      version: 6,
      revert_to_version: 5,
      materialized: true

    add_index :dashboards_sources_mv,
      :name,
      name: 'dashboards_sources_mv_name_idx'
    add_index :dashboards_companies_mv,
      :name,
      name: 'dashboards_companies_mv_name_idx'
    add_index :dashboards_destinations_mv,
      :name,
      name: 'dashboards_destinations_mv_name_idx'
    add_index :dashboards_companies_mv,
      [:id, :name, :node_type],
      name: 'dashboards_companies_mv_group_columns_idx'
    add_index :dashboards_destinations_mv,
      [:id, :name, :node_type],
      name: 'dashboards_destinations_mv_group_columns_idx'
  end
end
