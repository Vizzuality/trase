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
        'quants',
        'inds',
        'quals',
        'node_quants',
        'node_inds',
        'node_quals',
        'flow_quants',
        'flow_inds',
        'flow_quals',
        'map_attribute_groups',
        'map_attributes',
        'map_quants',
        'map_inds',
        'recolor_by_attributes',
        'recolor_by_inds',
        'recolor_by_quals',
        'resize_by_attributes',
        'resize_by_quants',
        'download_attributes',
        'download_quants',
        'download_quals'
      ].each do |table|
        copy_data(table)
      end
      populate_contextual_layers
      refresh_materialized_view('attributes_mv')
      refresh_materialized_view('map_attributes_mv')
      refresh_materialized_view('recolor_by_attributes_mv')
      refresh_materialized_view('resize_by_attributes_mv')
      refresh_materialized_view('download_attributes_mv')
    end
  end
end

def truncate_table(table)
  ActiveRecord::Base.connection.execute(
    "TRUNCATE revamp.#{table} CASCADE"
  )
end

def copy_data(table)
  truncate_table(table)
  affected_rows = ActiveRecord::Base.connection.execute(
    send("#{table}_insert_sql")
  ).cmd_tuples
  Rails.logger.debug "#{table}: #{affected_rows} affected rows"
  ActiveRecord::Base.connection.execute(
    "SELECT setval(pg_get_serial_sequence('revamp.#{table}', 'id'), coalesce(max(id),0) + 1, false) FROM revamp.#{table};"
  )
end

def refresh_materialized_view(mview)
  ActiveRecord::Base.connection.execute(
    "REFRESH MATERIALIZED VIEW revamp.#{mview}"
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
  INSERT INTO revamp.contexts (id, country_id, commodity_id, years, default_year, default_basemap, is_disabled, is_default, created_at, updated_at)
  SELECT
    id, country_id, commodity_id, years, default_year, default_basemap,
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

def quants_insert_sql
  <<-SQL
  INSERT INTO revamp.quants (id, name, unit, unit_type, tooltip, tooltip_text, frontend_name, created_at, updated_at)
  SELECT quant_id, name, unit, unit_type, COALESCE(tooltip, FALSE), tooltip_text, frontend_name, NOW(), NOW() FROM public.quants
  SQL
end

def inds_insert_sql
  <<-SQL
  INSERT INTO revamp.inds (id, name, unit, unit_type, tooltip, tooltip_text, frontend_name, created_at, updated_at)
  SELECT ind_id, name, unit, unit_type, COALESCE(tooltip, FALSE), tooltip_text, frontend_name, NOW(), NOW() FROM public.inds
  SQL
end

def quals_insert_sql
  <<-SQL
  INSERT INTO revamp.quals (id, name, tooltip, tooltip_text, frontend_name, created_at, updated_at)
  SELECT qual_id, name, COALESCE(tooltip, FALSE), tooltip_text, frontend_name, NOW(), NOW() FROM public.quals
  SQL
end

def node_quants_insert_sql
  <<-SQL
  INSERT INTO revamp.node_quants (node_id, quant_id, year, value, created_at, updated_at)
  SELECT DISTINCT node_id, quant_id, year, value, NOW(), NOW()
  FROM public.node_quants
  SQL
end

def node_inds_insert_sql
  <<-SQL
  INSERT INTO revamp.node_inds (node_id, ind_id, year, value, created_at, updated_at)
  SELECT DISTINCT node_id, ind_id, year, value, NOW(), NOW()
  FROM public.node_inds
  SQL
end

def node_quals_insert_sql
  <<-SQL
  INSERT INTO revamp.node_quals (node_id, qual_id, year, value, created_at, updated_at)
  SELECT DISTINCT node_id, qual_id, year, value, NOW(), NOW()
  FROM public.node_quals
  SQL
end

def flow_quants_insert_sql
  <<-SQL
  INSERT INTO revamp.flow_quants (flow_id, quant_id, value, created_at, updated_at)
  SELECT DISTINCT flow_id, quant_id, value, NOW(), NOW()
  FROM public.flow_quants
  SQL
end

def flow_inds_insert_sql
  <<-SQL
  INSERT INTO revamp.flow_inds (flow_id, ind_id, value, created_at, updated_at)
  SELECT DISTINCT flow_id, ind_id, value, NOW(), NOW()
  FROM public.flow_inds
  SQL
end

def flow_quals_insert_sql
  <<-SQL
  INSERT INTO revamp.flow_quals (flow_id, qual_id, value, created_at, updated_at)
  SELECT DISTINCT flow_id, qual_id, value, NOW(), NOW()
  FROM public.flow_quals
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
  INSERT INTO revamp.map_attributes(id, map_attribute_group_id, position, bucket_3, bucket_5, color_scale, years, is_disabled, is_default, created_at, updated_at)
  SELECT
    id, context_layer_group_id, position, bucket_3, bucket_5, color_scale, years, NOT(COALESCE(enabled, FALSE)), COALESCE(is_default, FALSE), NOW(), NOW()
  FROM public.context_layer
  SQL
end

def map_quants_insert_sql
  <<-SQL
  INSERT INTO revamp.map_quants(map_attribute_id, quant_id, created_at, updated_at)
  SELECT
    revamp.map_attributes.id, public.context_layer.layer_attribute_id, NOW(), NOW()
  FROM public.context_layer
  JOIN revamp.map_attributes ON public.context_layer.id = revamp.map_attributes.id AND public.context_layer.layer_attribute_type = 'Quant'
  SQL
end

def map_inds_insert_sql
  <<-SQL
  INSERT INTO revamp.map_inds(map_attribute_id, ind_id, created_at, updated_at)
  SELECT
    revamp.map_attributes.id, public.context_layer.layer_attribute_id, NOW(), NOW()
  FROM public.context_layer
  JOIN revamp.map_attributes ON public.context_layer.id = revamp.map_attributes.id AND public.context_layer.layer_attribute_type = 'Ind'
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
  INSERT INTO revamp.recolor_by_attributes(id, context_id, group_number, position, legend_type, legend_color_theme, interval_count, min_value, max_value, divisor, tooltip_text, years, is_disabled, is_default, created_at, updated_at)
  SELECT
    id, context_id, group_number, position, legend_type, legend_color_theme, interval_count, min_value, max_value, divisor, tooltip_text, years, COALESCE(is_disabled, FALSE), COALESCE(is_default, FALSE), NOW(), NOW()
  FROM context_recolor_by_with_years context_recolor_by
  SQL
end

def recolor_by_inds_insert_sql
  <<-SQL
  INSERT INTO revamp.recolor_by_inds(recolor_by_attribute_id, ind_id, created_at, updated_at)
  SELECT
    revamp.recolor_by_attributes.id, public.context_recolor_by.recolor_attribute_id, NOW(), NOW()
  FROM public.context_recolor_by
  JOIN revamp.recolor_by_attributes ON public.context_recolor_by.id = revamp.recolor_by_attributes.id AND public.context_recolor_by.recolor_attribute_type = 'Ind'
  SQL
end

def recolor_by_quals_insert_sql
  <<-SQL
  INSERT INTO revamp.recolor_by_quals(recolor_by_attribute_id, qual_id, created_at, updated_at)
  SELECT
    revamp.recolor_by_attributes.id, public.context_recolor_by.recolor_attribute_id, NOW(), NOW()
  FROM public.context_recolor_by
  JOIN revamp.recolor_by_attributes ON public.context_recolor_by.id = revamp.recolor_by_attributes.id AND public.context_recolor_by.recolor_attribute_type = 'Qual'
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
  INSERT INTO revamp.resize_by_attributes(id, context_id, group_number, position, tooltip_text, years, is_disabled, is_default, created_at, updated_at)
  SELECT
    id, context_id, group_number, position, tooltip_text, years, COALESCE(is_disabled, FALSE), COALESCE(is_default, FALSE), NOW(), NOW()
  FROM context_resize_by_with_years context_resize_by
  SQL
end

def resize_by_quants_insert_sql
  <<-SQL
  INSERT INTO revamp.resize_by_quants(resize_by_attribute_id, quant_id, created_at, updated_at)
  SELECT
    revamp.resize_by_attributes.id, public.context_resize_by.resize_attribute_id, NOW(), NOW()
  FROM public.context_resize_by
  JOIN revamp.resize_by_attributes ON public.context_resize_by.id = revamp.resize_by_attributes.id AND public.context_resize_by.resize_attribute_type = 'Quant'
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
  INSERT INTO revamp.download_attributes(id, context_id, position, name_in_download, years, created_at, updated_at)
  SELECT
    id, context_id, position, name_in_download, years, NOW(), NOW()
  FROM context_indicators_with_years context_indicators
  SQL
end

def download_quants_insert_sql
  <<-SQL
  INSERT INTO revamp.download_quants(download_attribute_id, quant_id, created_at, updated_at)
  SELECT
    revamp.download_attributes.id, public.context_indicators.indicator_attribute_id, NOW(), NOW()
  FROM public.context_indicators
  JOIN revamp.download_attributes ON public.context_indicators.id = revamp.download_attributes.id AND public.context_indicators.indicator_attribute_type = 'Quant'
  SQL
end

def download_quals_insert_sql
  <<-SQL
  INSERT INTO revamp.download_quals(download_attribute_id, qual_id, created_at, updated_at)
  SELECT
    revamp.download_attributes.id, public.context_indicators.indicator_attribute_id, NOW(), NOW()
  FROM public.context_indicators
  JOIN revamp.download_attributes ON public.context_indicators.id = revamp.download_attributes.id AND public.context_indicators.indicator_attribute_type = 'Qual'
  SQL
end

  def populate_contextual_layers
    truncate_table('contextual_layers')
    truncate_table('carto_layers')
    brazil_soy_query = <<-SQL
      SELECT c.id, default_context_layers
      FROM context c
      JOIN revamp.countries ctry ON ctry.id = c.country_id
      JOIN revamp.commodities comm ON comm.id = c.commodity_id
      WHERE ctry.iso2 = 'BR' AND comm.name = 'SOY'
    SQL
    brazil_soy = ActiveRecord::Base.connection.execute(brazil_soy_query).first
    return unless brazil_soy.present?
    @pg_decoder = PG::TextDecoder::Array.new name: "TEXT[]", delimiter: ','
    brazil_soy_default_context_layers = @pg_decoder.decode(brazil_soy['default_context_layers'])

    brazil_soy_contextual_layers = [
      {
        title: 'Land cover',
        identifier: 'landcover',
        position: 0,
        carto_layers: [{identifier: 'landcover'}]
      },
      {
        title: 'Brazil biomes',
        identifier: 'brazil_biomes',
        position: 1,
        is_default: true,
        carto_layers: [{identifier: 'brazil_biomes'}]
      },
      {
        title: 'Water scarcity',
        identifier: 'water_scarcity',
        position: 2,
        carto_layers: [{identifier: 'water_scarcity'}]
      },
      {
        title: 'Indigenous areas',
        identifier: 'indigenous_areas',
        position: 3,
        carto_layers: [{identifier: 'indigenous_areas'}]
      },
      {
        title: 'Brazil protected areas',
        identifier: 'brazil_protected',
        position: 4,
        carto_layers: [{identifier: 'brazil_protected'}]
      },
      {
        title: 'Deforestation polygons',
        identifier: 'brazil_defor_alerts',
        position: 5,
        carto_layers: [{identifier: 'brazil_defor_alerts'}]
      }
    ]

    brazil_soy_contextual_layers.each do |cl|
      is_default = brazil_soy_default_context_layers.include?(cl[:identifier])
      inserted_cl = ActiveRecord::Base.connection.execute(
        "INSERT INTO revamp.contextual_layers (context_id, title, identifier, position, is_default, created_at, updated_at) VALUES (#{brazil_soy['id']}, '#{cl[:title]}', '#{cl[:identifier]}', #{cl[:position]}, #{is_default}, NOW(), NOW()) RETURNING id;"
      ).first
      if inserted_cl.present?
        cl[:carto_layers].each do |clv|
          ActiveRecord::Base.connection.execute(
            "INSERT INTO revamp.carto_layers (contextual_layer_id, identifier, created_at, updated_at) VALUES (#{inserted_cl['id']}, '#{clv[:identifier]}', NOW(), NOW())"
          )
        end
      end
    end
  end
