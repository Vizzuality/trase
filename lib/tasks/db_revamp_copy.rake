namespace :db do
  namespace :revamp do
    desc 'Copy data from public schema into revamp schema'
    task copy: [:environment] do
      [
        'countries',
        'commodities',
        'contexts',
        'node_types',
        'context_node_types',
        'nodes',
        'flows',
        'attributes',
        'map_attribute_groups',
        'map_attributes',
        'recolor_by_attributes'
      ].each do |table|
        copy_data(table)
      end
    end
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
  INSERT INTO revamp.recolor_by_attributes(id, context_id, attribute_id, group_number, position, legend_type, legend_color_theme, interval_count, min_value, max_value, divisor, tooltip_text, is_disabled, is_default, created_at, updated_at)
  SELECT
    public.context_recolor_by.id, context_id, revamp.attributes.id, group_number, position, legend_type, legend_color_theme, interval_count, min_value, max_value, divisor, public.context_recolor_by.tooltip_text, COALESCE(is_disabled, FALSE), COALESCE(is_default, FALSE), NOW(), NOW()
  FROM public.context_recolor_by
  JOIN revamp.attributes ON public.context_recolor_by.recolor_attribute_type::text = revamp.attributes.type AND public.context_recolor_by.recolor_attribute_id = revamp.attributes.original_id;
  SQL
end
