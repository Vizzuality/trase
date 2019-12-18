class CreateDashboardsNodes < ActiveRecord::Migration[5.2]
  def up
    [
      Api::V3::Readonly::Dashboards::Source,
      Api::V3::Readonly::Dashboards::Exporter,
      Api::V3::Readonly::Dashboards::Importer,
      Api::V3::Readonly::Dashboards::Company,
      Api::V3::Readonly::Dashboards::Destination
    ].each do |klass|
      table_name = klass.table_name

      create_table table_name, primary_key: %i[id country_id commodity_id year] do |t|
        t.integer :id
        t.integer :node_type_id
        t.integer :context_id
        t.integer :country_id
        t.integer :commodity_id
        t.column :nodes_ids, 'int[]'
        t.column :year, 'smallint'
        t.text :name
        t.column :name_tsvector, 'tsvector'
        t.text :node_type
        t.text :profile
        t.column :rank_by_year, 'jsonb'
      end

      create_view "#{table_name}_v", materialized: false

      klass.refresh(
        sync: (Rails.env.development? || Rails.env.test?)
      )

      drop_view "#{table_name}_mv", materialized: true
    end
  end

  def down
    create_view 'dashboards_sources_mv', version: 9, materialized: true
    create_view 'dashboards_exporters_mv', version: 2, materialized: true
    create_view 'dashboards_importers_mv', version: 2, materialized: true
    create_view 'dashboards_companies_mv', version: 7, materialized: true
    create_view 'dashboards_destinations_mv', version: 8, materialized: true

    redo_dashboards_sources_indexes
    redo_dashboards_exporters_indexes
    redo_dashboards_importers_indexes
    redo_dashboards_companies_indexes
    redo_dashboards_destinations_indexes
    [
      Api::V3::Readonly::Dashboards::Source,
      Api::V3::Readonly::Dashboards::Exporter,
      Api::V3::Readonly::Dashboards::Importer,
      Api::V3::Readonly::Dashboards::Company,
      Api::V3::Readonly::Dashboards::Destination
    ].each do |klass|
      table_name = klass.table_name
      drop_table table_name
      drop_view "#{table_name}_v", materialized: false
    end
  end

  def redo_dashboards_sources_indexes
    add_index :dashboards_sources_mv,
      :commodity_id,
      name: 'dashboards_sources_mv_commodity_id_idx'
    add_index :dashboards_sources_mv,
      :country_id,
      name: 'dashboards_sources_mv_country_id_idx'
    add_index :dashboards_sources_mv,
      :name_tsvector,
      name: 'dashboards_sources_mv_name_tsvector_idx',
      using: :gin
    add_index :dashboards_sources_mv,
      :node_id,
      name: 'dashboards_sources_mv_node_id_idx'
    add_index :dashboards_sources_mv,
      :node_type_id,
      name: 'dashboards_sources_mv_node_type_id_idx'
    add_index :dashboards_sources_mv,
      [:id, :node_id, :country_id, :commodity_id],
      unique: true,
      name: 'dashboards_sources_unique_idx'
  end

  def redo_dashboards_exporters_indexes
    add_index :dashboards_exporters_mv,
      :commodity_id,
      name: 'dashboards_exporters_mv_commodity_id_idx'
    add_index :dashboards_exporters_mv,
      :country_id,
      name: 'dashboards_exporters_mv_country_id_idx'
    add_index :dashboards_exporters_mv,
      :name_tsvector,
      name: 'dashboards_exporters_mv_name_tsvector_idx',
      using: :gin
    add_index :dashboards_exporters_mv,
      :node_id,
      name: 'dashboards_exporters_mv_node_id_idx'
    add_index :dashboards_exporters_mv,
      :node_type_id,
      name: 'dashboards_exporters_mv_node_type_id_idx'
    add_index :dashboards_exporters_mv,
      [:id, :node_id, :country_id, :commodity_id],
      unique: true,
      name: 'dashboards_exporters_mv_unique_idx'
  end

  def redo_dashboards_importers_indexes
    add_index :dashboards_importers_mv,
      :commodity_id,
      name: 'dashboards_importers_mv_commodity_id_idx'
    add_index :dashboards_importers_mv,
      :country_id,
      name: 'dashboards_importers_mv_country_id_idx'
    add_index :dashboards_importers_mv,
      :name_tsvector,
      name: 'dashboards_importers_mv_name_tsvector_idx',
      using: :gin
    add_index :dashboards_importers_mv,
      :node_id,
      name: 'dashboards_importers_mv_node_id_idx'
    add_index :dashboards_importers_mv,
      :node_type_id,
      name: 'dashboards_importers_mv_node_type_id_idx'
    add_index :dashboards_importers_mv,
      [:id, :node_id, :country_id, :commodity_id],
      unique: true,
      name: 'dashboards_importers_mv_unique_idx'
  end

  def redo_dashboards_companies_indexes
    add_index :dashboards_companies_mv,
      :commodity_id,
      name: 'dashboards_companies_mv_commodity_id_idx'
    add_index :dashboards_companies_mv,
      :country_id,
      name: 'dashboards_companies_mv_country_id_idx'
    add_index :dashboards_companies_mv,
      :name_tsvector,
      name: 'dashboards_companies_mv_name_tsvector_idx',
      using: :gin
    add_index :dashboards_companies_mv,
      :node_id,
      name: 'dashboards_companies_mv_node_id_idx'
    add_index :dashboards_companies_mv,
      :node_type_id,
      name: 'dashboards_companies_mv_node_type_id_idx'
    add_index :dashboards_companies_mv,
      [:id, :node_id, :country_id, :commodity_id],
      unique: true,
      name: 'dashboards_companies_mv_unique_idx'
  end

  def redo_dashboards_destinations_indexes
    add_index :dashboards_destinations_mv,
      :country_id,
      name: 'dashboards_destinations_mv_country_id_idx'
    add_index :dashboards_destinations_mv,
      :commodity_id,
      name: 'dashboards_destinations_mv_commodity_id_idx'
    add_index :dashboards_destinations_mv,
      :name_tsvector,
      name: 'dashboards_destinations_mv_name_tsvector_idx',
      using: :gin
    add_index :dashboards_destinations_mv,
      :node_id,
      name: 'dashboards_destinations_mv_node_id_idx'
    add_index :dashboards_destinations_mv,
      :node_type_id,
      name: 'dashboards_destinations_mv_node_type_id_idx'
    add_index :dashboards_destinations_mv,
      [:id, :node_id, :country_id, :commodity_id],
      unique: true,
      name: 'dashboards_destinations_mv_unique_idx'
  end
end
