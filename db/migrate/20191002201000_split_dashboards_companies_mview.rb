class SplitDashboardsCompaniesMview < ActiveRecord::Migration[5.2]
  def up
    create_view :dashboards_exporters_mv,
      version: 1,
      materialized: true
    add_index :dashboards_exporters_mv,
      [:id, :node_id, :country_id, :commodity_id],
      unique: true,
      name: 'dashboards_exporters_mv_unique_idx'
    add_index :dashboards_exporters_mv,
      :commodity_id,
      name: 'dashboards_exporters_mv_commodity_id_idx'
    add_index :dashboards_exporters_mv,
      :country_id,
      name: 'dashboards_exporters_mv_country_id_idx'
    add_index :dashboards_exporters_mv,
      :node_id,
      name: 'dashboards_exporters_mv_node_id_idx'
    add_index :dashboards_exporters_mv,
      :node_type_id,
      name: 'dashboards_exporters_mv_node_type_id_idx'
    add_index :dashboards_exporters_mv,
      :name_tsvector,
      name: 'dashboards_exporters_mv_name_tsvector_idx',
      using: :gin

    create_view :dashboards_importers_mv,
      version: 1,
      materialized: true
    add_index :dashboards_importers_mv,
      [:id, :node_id, :country_id, :commodity_id],
      unique: true,
      name: 'dashboards_importers_mv_unique_idx'
    add_index :dashboards_importers_mv,
      :commodity_id,
      name: 'dashboards_importers_mv_commodity_id_idx'
    add_index :dashboards_importers_mv,
      :country_id,
      name: 'dashboards_importers_mv_country_id_idx'
    add_index :dashboards_importers_mv,
      :node_id,
      name: 'dashboards_importers_mv_node_id_idx'
    add_index :dashboards_importers_mv,
      :node_type_id,
      name: 'dashboards_importers_mv_node_type_id_idx'
    add_index :dashboards_importers_mv,
      :name_tsvector,
      name: 'dashboards_importers_mv_name_tsvector_idx',
      using: :gin
  end

  def down
    drop_view :dashboards_exporters_mv,
      materialized: true
    drop_view :dashboards_importers_mv,
      materialized: true
  end
end
