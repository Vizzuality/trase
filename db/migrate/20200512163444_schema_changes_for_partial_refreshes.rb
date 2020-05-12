class SchemaChangesForPartialRefreshes < ActiveRecord::Migration[5.2]
  def up
    with_search_path('maintenance') do
      create_view :refresh_dependencies, materialized: false
    end

    Api::V3::Readonly::NodesPerContextRankedByVolumePerYear.refresh(
      sync: (Rails.env.development? || Rails.env.test?)
    )

    [
      Api::V3::Readonly::Dashboards::Source,
      Api::V3::Readonly::Dashboards::Exporter,
      Api::V3::Readonly::Dashboards::Importer,
      Api::V3::Readonly::Dashboards::Company,
      Api::V3::Readonly::Dashboards::Destination
    ].each do |klass|
      table_name = klass.table_name

      drop_table table_name

      create_table table_name, primary_key: %i[id country_id commodity_id year] do |t|
        t.integer :id
        t.integer :node_type_id
        t.integer :context_id
        t.integer :country_id
        t.integer :commodity_id
        t.integer :context_node_type_id
        t.column :year, 'smallint'
        t.text :name
        t.column :name_tsvector, 'tsvector'
        t.text :node_type
        t.text :profile
        t.column :rank_by_year, 'jsonb'
      end

      update_view :"#{table_name}_v", materialized: false, version: 4, revert_to_version: 3

      klass.refresh(
        sync: (Rails.env.development? || Rails.env.test?)
      )
    end

    drop_table :dashboards_commodities
    drop_table :dashboards_countries

    update_view :dashboards_commodities_v, version: 4, revert_to_version: 3, materialized: false
    update_view :dashboards_countries_v, version: 4, revert_to_version: 3, materialized: false

    create_table :dashboards_commodities, primary_key: %i[id node_id country_id year] do |t|
      t.integer :id
      t.integer :country_id
      t.integer :node_id
      t.integer :context_node_type_id
      t.column :year, 'smallint'
      t.text :name
      t.column :name_tsvector, 'tsvector'
      t.text :profile
    end

    create_table :dashboards_countries, primary_key: %i[id node_id commodity_id year] do |t|
      t.integer :id
      t.integer :commodity_id
      t.integer :node_id
      t.integer :context_node_type_id
      t.column :year, 'smallint'
      t.text :iso2
      t.text :name
      t.column :name_tsvector, 'tsvector'
      t.text :profile
    end

    Api::V3::Readonly::Dashboards::Commodity.refresh(
      sync: (Rails.env.development? || Rails.env.test?)
    )
    Api::V3::Readonly::Dashboards::Country.refresh(
      sync: (Rails.env.development? || Rails.env.test?)
    )

    create_view :flow_qual_distinct_values_mv, materialized: true
    add_index :flow_qual_distinct_values_mv, [:context_id, :qual_id], unique: true,
      name: 'flow_qual_distinct_values_mv_context_id_qual_id_idx'

    create_view :chart_attributes_v, materialized: false
    drop_view :chart_attributes_mv, materialized: true

    create_view :dashboards_attributes_v, materialized: false
    drop_view :dashboards_attributes_mv, materialized: true

    create_view :download_attributes_v, materialized: false
    drop_view :download_attributes_mv, materialized: true

    create_view :map_attributes_v, materialized: false
    drop_view :map_attributes_mv, materialized: true

    create_view :recolor_by_attributes_v, materialized: false
    drop_view :recolor_by_attributes_mv, materialized: true

    create_view :resize_by_attributes_v, materialized: false
    drop_view :resize_by_attributes_mv, materialized: true

    drop_table :nodes_with_flows_or_geo

    drop_view :map_attributes_values_v, materialized: false
    update_view :nodes_with_flows_or_geo_v, materialized: false, version: 2, revert_to_version: 1
    create_view :map_attributes_values_v, materialized: false

    create_table :nodes_with_flows_or_geo, primary_key: %i[id context_id] do |t|
      t.integer :id
      t.integer :context_id
      t.integer :node_type_id
      t.integer :context_node_type_id
      t.integer :main_id
      t.boolean :is_unknown
      t.boolean :is_domestic_consumption
      t.boolean :is_aggregated
      t.boolean :has_flows
      t.text :name
      t.text :node_type
      t.text :geo_id
      t.text :profile
    end

    Api::V3::Readonly::NodeWithFlowsOrGeo.refresh(
      sync: (Rails.env.development? || Rails.env.test?)
    )

    add_column :attributes, :tooltip_text_by_context_id, 'JSONB'
    add_column :attributes, :tooltip_text_by_country_id, 'JSONB'
    add_column :attributes, :tooltip_text_by_commodity_id, 'JSONB'

    update_view :attributes_v, materialized: false, version: 2
    function =<<~SQL
CREATE OR REPLACE FUNCTION public.upsert_attributes() RETURNS void
    LANGUAGE sql
    AS $$

INSERT INTO attributes (
  original_id,
  original_type,
  name,
  display_name,
  unit,
  unit_type,
  tooltip_text,
  tooltip_text_by_context_id,
  tooltip_text_by_commodity_id,
  tooltip_text_by_country_id
)
SELECT
  original_id,
  original_type,
  name,
  display_name,
  unit,
  unit_type,
  tooltip_text,
  tooltip_text_by_context_id,
  tooltip_text_by_commodity_id,
  tooltip_text_by_country_id
FROM attributes_v

EXCEPT

SELECT
  original_id,
  original_type,
  name,
  display_name,
  unit,
  unit_type,
  tooltip_text,
  tooltip_text_by_context_id,
  tooltip_text_by_commodity_id,
  tooltip_text_by_country_id
FROM attributes
ON CONFLICT (name, original_type) DO UPDATE SET
  original_id = excluded.original_id,
  display_name = excluded.display_name,
  unit = excluded.unit,
  unit_type = excluded.unit_type,
  tooltip_text = excluded.tooltip_text,
  tooltip_text_by_context_id = excluded.tooltip_text_by_context_id,
  tooltip_text_by_commodity_id = excluded.tooltip_text_by_commodity_id,
  tooltip_text_by_country_id = excluded.tooltip_text_by_country_id;

DELETE FROM attributes
USING (
  SELECT
    original_id,
    original_type,
    name,
    display_name,
    unit,
    unit_type,
    tooltip_text,
    tooltip_text_by_context_id,
    tooltip_text_by_commodity_id,
    tooltip_text_by_country_id
  FROM attributes

  EXCEPT

  SELECT
    original_id,
    original_type,
    name,
    display_name,
    unit,
    unit_type,
    tooltip_text,
    tooltip_text_by_context_id,
    tooltip_text_by_commodity_id,
    tooltip_text_by_country_id
  FROM attributes_v
) s
WHERE attributes.name = s.name AND attributes.original_type = s.original_type;
$$;
    SQL
    execute function

    drop_view :context_attribute_properties_mv, materialized: true
    drop_view :country_attribute_properties_mv, materialized: true
    drop_view :commodity_attribute_properties_mv, materialized: true

    create_view :contexts_v, materialized: false
    drop_view :contexts_mv, materialized: true

    create_view :flow_attributes_v, materialized: false
    create_table :flow_attributes, primary_key: %i[attribute_id context_id] do |t|
      t.integer :attribute_id
      t.integer :context_id
      t.column :years, 'smallint[]'
      t.text :name
      t.text :display_name
      t.text :unit
      t.text :unit_type
      t.column :distinct_values, 'text[]'
    end
    Api::Public::Readonly::FlowAttribute.refresh(
      sync: (Rails.env.development? || Rails.env.test?)
    )
    drop_view :flow_attributes_mv, materialized: true

    create_view :node_stats_mv, materialized: true
    add_index :node_stats_mv,
      [:context_id, :year, :quant_id, :node_id, :node_type_id],
      unique: true,
      name: 'node_stats_mv_context_year_quant_node_node_type_idx'
    drop_view :nodes_stats_mv, materialized: true
  end

  def down
    create_view :nodes_stats_mv, materialized: true
    add_index :nodes_stats_mv,
      [:context_id, :year, :quant_id, :node_id, :node_type_id],
      unique: true,
      name: 'nodes_stats_mv_context_year_quant_node_node_type_idx'
    drop_view :node_stats_mv, materialized: true

    create_view :flow_attributes_mv, version: 3, materialized: true
    drop_table :flow_attributes
    drop_view :flow_attributes_v, materialized: false

    create_view :contexts_mv, materialized: true
    drop_view :contexts_v, materialized: false

    create_view :context_attribute_properties_mv, materialized: true
    create_view :country_attribute_properties_mv, materialized: true
    create_view :commodity_attribute_properties_mv, materialized: true

    function =<<~SQL
CREATE OR REPLACE FUNCTION public.upsert_attributes() RETURNS void
    LANGUAGE sql
    AS $$

INSERT INTO attributes (
  original_id,
  original_type,
  name,
  display_name,
  unit,
  unit_type,
  tooltip_text
)
SELECT
  original_id,
  original_type,
  name,
  display_name,
  unit,
  unit_type,
  tooltip_text
FROM attributes_v

EXCEPT

SELECT
  original_id,
  original_type,
  name,
  display_name,
  unit,
  unit_type,
  tooltip_text
FROM attributes
ON CONFLICT (name, original_type) DO UPDATE SET
  original_id = excluded.original_id,
  display_name = excluded.display_name,
  unit = excluded.unit,
  unit_type = excluded.unit_type,
  tooltip_text = excluded.tooltip_text;

DELETE FROM attributes
USING (
  SELECT
    original_id,
    original_type,
    name,
    display_name,
    unit,
    unit_type,
    tooltip_text
  FROM attributes

  EXCEPT

  SELECT
    original_id,
    original_type,
    name,
    display_name,
    unit,
    unit_type,
    tooltip_text
  FROM attributes_v
) s
WHERE attributes.name = s.name AND attributes.original_type = s.original_type;
$$;
    SQL
    execute function
    update_view :attributes_v, materialized: false, version: 1

    remove_column :attributes, :tooltip_text_by_context_id
    remove_column :attributes, :tooltip_text_by_country_id
    remove_column :attributes, :tooltip_text_by_commodity_id

    drop_view :map_attributes_values_v, materialized: false
    update_view :nodes_with_flows_or_geo_v, materialized: false, version: 1
    create_view :map_attributes_values_v, materialized: false
    remove_column :nodes_with_flows_or_geo, :context_node_type_id

    create_view :chart_attributes_mv, materialized: true, version: 4
    drop_view :chart_attributes_v, materialized: false

    create_view :dashboards_attributes_mv, materialized: true, version: 3
    drop_view :dashboards_attributes_v, materialized: false

    create_view :download_attributes_mv, materialized: true, version: 4
    drop_view :download_attributes_v, materialized: false

    create_view :map_attributes_mv, materialized: true, version: 5
    drop_view :map_attributes_v, materialized: false

    create_view :recolor_by_attributes_mv, materialized: true, version: 4
    drop_view :recolor_by_attributes_v, materialized: false

    create_view :resize_by_attributes_mv, materialized: true, version: 3
    drop_view :resize_by_attributes_v, materialized: false

    drop_view :flow_qual_distinct_values_mv, materialized: true

    remove_column :dashboards_commodities, :context_node_type_id
    remove_column :dashboards_countries, :context_node_type_id

    update_view :dashboards_commodities_v, version: 3, revert_to_version: 2, materialized: false
    update_view :dashboards_countries_v, version: 3, revert_to_version: 2, materialized: false

    [
      Api::V3::Readonly::Dashboards::Source,
      Api::V3::Readonly::Dashboards::Exporter,
      Api::V3::Readonly::Dashboards::Importer,
      Api::V3::Readonly::Dashboards::Company,
      Api::V3::Readonly::Dashboards::Destination
    ].each do |klass|
      table_name = klass.table_name
      remove_column table_name, :context_node_type_id
      update_view :"#{table_name}_v", materialized: false, version: 3, revert_to_version: 2
    end

    with_search_path('maintenance') do
      drop_view :refresh_dependencies, materialized: false
    end
  end
end
