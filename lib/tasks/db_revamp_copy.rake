namespace :db do
  namespace :revamp do
    desc 'Copy data from public schema into revamp schema'
    task copy: [:environment] do
      create_migration_columns
      [
        'countries',
        'commodities',
        'contexts',
        'node_types',
        'context_node_types',
        'nodes',
        'flows',
        'attributes',
        'node_attributes',
        'node_attributes_double_values',
        'node_attributes_text_values',
        'flow_attributes',
        'flow_attributes_double_values',
        'flow_attributes_text_values',
        'map_attribute_groups',
        'map_attributes',
        'recolor_by_attributes',
        'resize_by_attributes',
        'download_attributes'
      ].each do |table|
        copy_data(table)
      end
      drop_migration_columns
    end
  end
end

def migration_columns
  [
    ['revamp.attributes', 'original_id', 'INTEGER'],
    ['revamp.node_attributes', 'original_id', 'INTEGER'],
    ['revamp.flow_attributes', 'original_id', 'INTEGER']
  ]
end

def create_migration_columns
  migration_columns.each do |table_column_type|
    ActiveRecord::Base.connection.execute(
      "ALTER TABLE #{table_column_type.first} ADD COLUMN IF NOT EXISTS #{table_column_type.second} #{table_column_type.third}"
    )
  end
end

def drop_migration_columns
  migration_columns.each do |table_column|
    ActiveRecord::Base.connection.execute(
      "ALTER TABLE #{table_column.first} DROP COLUMN IF EXISTS #{table_column.second}"
    )
  end
end

def copy_data(table)
  ActiveRecord::Base.connection.execute(
    "TRUNCATE revamp.#{table} CASCADE"
  )
  affected_rows = ActiveRecord::Base.connection.execute(
    send("#{table}_insert_sql")
  ).cmd_tuples
  Rails.logger.debug "#{table}: #{affected_rows} affected rows"
  ActiveRecord::Base.connection.execute(
    "SELECT setval(pg_get_serial_sequence('revamp.#{table}', 'id'), coalesce(max(id),0) + 1, false) FROM revamp.#{table};"
  )
end

def countries_insert_sql
  <<-SQL
  INSERT INTO revamp.countries (id, name, iso2, latitude, longitude, zoom, created_at, updated_at)
  SELECT country_id, name, iso2, latitude, longitude, zoom, NOW(), NOW()
  FROM public.countries;
  SQL
end

def commodities_insert_sql
  <<-SQL
  INSERT INTO revamp.commodities (id, name, created_at, updated_at)
  SELECT commodity_id, name, NOW(), NOW()
  FROM public.commodities;
  SQL
end

def contexts_insert_sql
  <<-SQL
  INSERT INTO revamp.contexts (id, country_id, commodity_id, years, default_year, default_context_layers, default_basemap, is_disabled, is_default, created_at, updated_at)
  SELECT
    id, country_id, commodity_id, years, default_year, default_context_layers, default_basemap,
    COALESCE(is_disabled, FALSE),
    COALESCE(is_default, FALSE),
    NOW(), NOW()
  FROM public.context;
  SQL
end

def node_types_insert_sql
  <<-SQL
  INSERT INTO revamp.node_types (id, name, created_at, updated_at)
  SELECT
    node_type_id, node_type, NOW(), NOW()
  FROM public.node_types;
  SQL
end

def context_node_types_insert_sql
  <<-SQL
  INSERT INTO revamp.context_node_types (id, context_id, node_type_id, column_group, column_position, is_default, is_geo_column, profile_type, created_at, updated_at)
  SELECT
    id, context_id, cnt.node_type_id, column_group, column_position,
    COALESCE(is_default, FALSE),
    COALESCE(is_geo_column, FALSE),
    profile_type,
    NOW(), NOW()
  FROM public.context_nodes cnt JOIN public.node_types nt ON cnt.node_type_id = nt.node_type_id;
  SQL
end

def nodes_insert_sql
  <<-SQL
  INSERT INTO revamp.nodes (id, node_type_id, name, geo_id, is_domestic_consumption, is_unknown, created_at, updated_at)
  SELECT
    node_id, node_type_id, name, geo_id,
    COALESCE(is_domestic_consumption, FALSE),
    COALESCE(is_unknown, FALSE),
    NOW(), NOW()
  FROM public.nodes;
  SQL
end

def flows_insert_sql
  <<-SQL
  INSERT INTO revamp.flows (id, context_id, year, path, created_at, updated_at)
  SELECT
    flow_id, context_id, year, path, NOW(), NOW()
  FROM public.flows;
  SQL
end

def attributes_insert_sql
  <<-SQL
  INSERT INTO revamp.attributes (name, type, unit, unit_type, tooltip, tooltip_text, frontend_name, original_id, created_at, updated_at)
  SELECT name, 'Quant', unit, unit_type, COALESCE(tooltip, FALSE), tooltip_text, frontend_name, quant_id, NOW(), NOW() FROM public.quants
  UNION ALL
  SELECT name, 'Ind', unit, unit_type, COALESCE(tooltip, FALSE), tooltip_text, frontend_name, ind_id, NOW(), NOW() FROM public.inds
  UNION ALL
  SELECT name, 'Qual', NULL, NULL, COALESCE(tooltip, FALSE), tooltip_text, frontend_name, qual_id, NOW(), NOW() FROM public.quals;
  SQL
end

def node_attributes_insert_sql
  <<-SQL
  INSERT INTO revamp.node_attributes (node_id, attribute_id, original_id, created_at, updated_at)
  SELECT DISTINCT node_id, attributes.id, quant_id, NOW(), NOW()
  FROM public.node_quants
  JOIN revamp.attributes ON public.node_quants.quant_id = revamp.attributes.original_id AND revamp.attributes.type = 'Quant'
  UNION ALL
  SELECT DISTINCT node_id, attributes.id, ind_id, NOW(), NOW()
  FROM public.node_inds
  JOIN revamp.attributes ON public.node_inds.ind_id = revamp.attributes.original_id AND revamp.attributes.type = 'Ind'
  UNION ALL
  SELECT DISTINCT node_id, attributes.id, qual_id, NOW(), NOW()
  FROM public.node_quals
  JOIN revamp.attributes ON public.node_quals.qual_id = revamp.attributes.original_id AND revamp.attributes.type = 'Qual'
  SQL
end

def node_attributes_double_values_insert_sql
  <<-SQL
  INSERT INTO revamp.node_attributes_double_values (node_attribute_id, year, value, created_at, updated_at)
  SELECT node_attributes.id, year, value, NOW(), NOW()
  FROM public.node_quants
  JOIN revamp.node_attributes ON public.node_quants.quant_id = revamp.node_attributes.original_id
  JOIN revamp.attributes ON revamp.node_attributes.attribute_id = attributes.id
  WHERE revamp.attributes.type = 'Quant' and node_attributes.node_id = node_quants.node_id
  UNION ALL
  SELECT node_attributes.id, year, value, NOW(), NOW()
  FROM public.node_inds
  JOIN revamp.node_attributes ON public.node_inds.ind_id = revamp.node_attributes.original_id
  JOIN revamp.attributes ON revamp.node_attributes.attribute_id = attributes.id
  WHERE revamp.attributes.type = 'Ind' and node_attributes.node_id = node_inds.node_id
  SQL
end

def node_attributes_text_values_insert_sql
  <<-SQL
  INSERT INTO revamp.node_attributes_text_values (node_attribute_id, year, value, created_at, updated_at)
  SELECT node_attributes.id, year, value, NOW(), NOW()
  FROM public.node_quals
  JOIN revamp.node_attributes ON public.node_quals.qual_id = revamp.node_attributes.original_id
  JOIN revamp.attributes ON revamp.node_attributes.attribute_id = attributes.id
  WHERE revamp.attributes.type = 'Qual' and node_attributes.node_id = node_quals.node_id
  SQL
end

def flow_attributes_insert_sql
  <<-SQL
  INSERT INTO revamp.flow_attributes (flow_id, attribute_id, original_id, created_at, updated_at)
  SELECT DISTINCT flow_id, attributes.id, quant_id, NOW(), NOW()
  FROM public.flow_quants
  JOIN revamp.attributes ON public.flow_quants.quant_id = revamp.attributes.original_id AND revamp.attributes.type = 'Quant'
  UNION ALL
  SELECT DISTINCT flow_id, attributes.id, ind_id, NOW(), NOW()
  FROM public.flow_inds
  JOIN revamp.attributes ON public.flow_inds.ind_id = revamp.attributes.original_id AND revamp.attributes.type = 'Ind'
  UNION ALL
  SELECT DISTINCT flow_id, attributes.id, qual_id, NOW(), NOW()
  FROM public.flow_quals
  JOIN revamp.attributes ON public.flow_quals.qual_id = revamp.attributes.original_id AND revamp.attributes.type = 'Qual'
  SQL
end

def flow_attributes_double_values_insert_sql
  <<-SQL
  INSERT INTO revamp.flow_attributes_double_values (flow_attribute_id, year, value, created_at, updated_at)
  SELECT flow_attributes.id, year, value, NOW(), NOW()
  FROM public.flow_quants
  JOIN revamp.flow_attributes ON public.flow_quants.quant_id = revamp.flow_attributes.original_id
  JOIN revamp.attributes ON revamp.flow_attributes.attribute_id = attributes.id
  JOIN public.flows ON public.flow_quants.flow_id = public.flows.flow_id
  WHERE revamp.attributes.type = 'Quant' and flow_attributes.flow_id = flow_quants.flow_id
  UNION ALL
  SELECT flow_attributes.id, year, value, NOW(), NOW()
  FROM public.flow_inds
  JOIN revamp.flow_attributes ON public.flow_inds.ind_id = revamp.flow_attributes.original_id
  JOIN revamp.attributes ON revamp.flow_attributes.attribute_id = attributes.id
  JOIN public.flows ON public.flow_inds.flow_id = public.flows.flow_id
  WHERE revamp.attributes.type = 'Ind'and flow_attributes.flow_id = flow_inds.flow_id
  SQL
end

def flow_attributes_text_values_insert_sql
  <<-SQL
  INSERT INTO revamp.flow_attributes_text_values (flow_attribute_id, year, value, created_at, updated_at)
  SELECT flow_attributes.id, year, value, NOW(), NOW()
  FROM public.flow_quals
  JOIN revamp.flow_attributes ON public.flow_quals.qual_id = revamp.flow_attributes.original_id
  JOIN revamp.attributes ON revamp.flow_attributes.attribute_id = revamp.attributes.id
  JOIN public.flows ON public.flow_quals.flow_id = public.flows.flow_id
  WHERE revamp.attributes.type = 'Qual' and flow_attributes.flow_id = flow_quals.flow_id
  SQL
end

def map_attribute_groups_insert_sql
  <<-SQL
  INSERT INTO revamp.map_attribute_groups(id, context_id, position, name, created_at, updated_at)
  SELECT
    id, context_id, position, name, NOW(), NOW()
  FROM public.context_layer_group;
  SQL
end

def map_attributes_insert_sql
  <<-SQL
  INSERT INTO revamp.map_attributes(id, map_attribute_group_id, attribute_id, position, bucket_3, bucket_5, color_scale, years, aggregate_method, is_disabled, is_default, created_at, updated_at)
  SELECT
    public.context_layer.id, context_layer_group_id, revamp.attributes.id, position, bucket_3, bucket_5, color_scale, years, aggregate_method, NOT(COALESCE(enabled, FALSE)), COALESCE(is_default, FALSE), NOW(), NOW()
  FROM public.context_layer
  JOIN revamp.attributes ON public.context_layer.layer_attribute_type::text = revamp.attributes.type AND public.context_layer.layer_attribute_id = revamp.attributes.original_id;
  SQL
end

def recolor_by_attributes_insert_sql
  <<-SQL
  WITH flow_inds_and_quals AS (
    SELECT 'Ind' AS attribute_type, ind_id AS attribute_id, flow_id FROM flow_inds
    UNION ALL
    SELECT 'Qual' AS attribute_type, qual_id AS attribute_id, flow_id FROM flow_quals
  ), context_recolor_by_with_years AS (
    SELECT context_recolor_by.*, ARRAY_AGG(DISTINCT year ORDER BY year) AS years
    FROM context_recolor_by
    LEFT JOIN flows ON flows.context_id = context_recolor_by.context_id
    LEFT JOIN flow_inds_and_quals ON flows.flow_id = flow_inds_and_quals.flow_id
    AND flow_inds_and_quals.attribute_type = context_recolor_by.recolor_attribute_type::text
    AND flow_inds_and_quals.attribute_id = context_recolor_by.recolor_attribute_id
    GROUP BY context_recolor_by.id
  )
  INSERT INTO revamp.recolor_by_attributes(id, context_id, attribute_id, group_number, position, legend_type, legend_color_theme, interval_count, min_value, max_value, divisor, tooltip_text, years, is_disabled, is_default, created_at, updated_at)
  SELECT
    context_recolor_by.id, context_id, revamp.attributes.id, group_number, position, legend_type, legend_color_theme, interval_count, min_value, max_value, divisor, context_recolor_by.tooltip_text, years, COALESCE(is_disabled, FALSE), COALESCE(is_default, FALSE), NOW(), NOW()
  FROM context_recolor_by_with_years context_recolor_by
  JOIN revamp.attributes ON context_recolor_by.recolor_attribute_type::text = revamp.attributes.type AND context_recolor_by.recolor_attribute_id = revamp.attributes.original_id;
  SQL
end

def resize_by_attributes_insert_sql
  <<-SQL
  WITH context_resize_by_with_years AS (
    SELECT context_resize_by.*, ARRAY_AGG(DISTINCT year ORDER BY year) AS years
    FROM context_resize_by
    LEFT JOIN flows ON flows.context_id = context_resize_by.context_id
    LEFT JOIN flow_quants ON flows.flow_id = flow_quants.flow_id AND flow_quants.quant_id = context_resize_by.resize_attribute_id
    GROUP BY context_resize_by.id
  )
  INSERT INTO revamp.resize_by_attributes(id, context_id, attribute_id, group_number, position, tooltip_text, years, is_disabled, is_default, created_at, updated_at)
  SELECT
    context_resize_by.id, context_id, revamp.attributes.id, group_number, position, context_resize_by.tooltip_text, years, COALESCE(is_disabled, FALSE), COALESCE(is_default, FALSE), NOW(), NOW()
  FROM context_resize_by_with_years context_resize_by
  JOIN revamp.attributes ON context_resize_by.resize_attribute_type::text = revamp.attributes.type AND context_resize_by.resize_attribute_id = revamp.attributes.original_id;
  SQL
end

def download_attributes_insert_sql
  <<-SQL
  WITH flow_quants_inds_and_quals AS (
    SELECT 'Quant' AS attribute_type, quant_id AS attribute_id, flow_id FROM flow_quants
    UNION ALL
    SELECT 'Ind' AS attribute_type, ind_id AS attribute_id, flow_id FROM flow_inds
    UNION ALL
    SELECT 'Qual' AS attribute_type, qual_id AS attribute_id, flow_id FROM flow_quals
  ), context_indicators_with_years AS (
    SELECT context_indicators.*, ARRAY_AGG(DISTINCT year ORDER BY year) AS years
    FROM context_indicators
    LEFT JOIN flows ON flows.context_id = context_indicators.context_id
    LEFT JOIN flow_quants_inds_and_quals ON flows.flow_id = flow_quants_inds_and_quals.flow_id
    AND flow_quants_inds_and_quals.attribute_type = context_indicators.indicator_attribute_type::text
    AND flow_quants_inds_and_quals.attribute_id = context_indicators.indicator_attribute_id
    GROUP BY context_indicators.id
  )
  INSERT INTO revamp.download_attributes(id, context_id, attribute_id, position, name_in_download, years, created_at, updated_at)
  SELECT
    context_indicators.id, context_id, revamp.attributes.id, position, name_in_download, years, NOW(), NOW()
  FROM context_indicators_with_years context_indicators
  JOIN revamp.attributes ON context_indicators.indicator_attribute_type::text = revamp.attributes.type AND context_indicators.indicator_attribute_id = revamp.attributes.original_id;
  SQL
end
