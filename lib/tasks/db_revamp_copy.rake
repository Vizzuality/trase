namespace :db do
  namespace :revamp do
    desc 'Refresh materialized views'
    task refresh: [:environment] do
      refresh_materialized_views
    end

    desc 'Copy data from public schema into revamp schema'
    task copy: [:environment] do
      %w[
        countries
        commodities
        contexts
        context_properties
        node_types
        context_node_types
        nodes
        flows
        quants
        inds
        quals
        node_quants
        node_inds
        node_quals
        flow_quants
        flow_inds
        flow_quals
        map_attribute_groups
        map_attributes
        map_quants
        map_inds
        recolor_by_attributes
        recolor_by_inds
        recolor_by_quals
        resize_by_attributes
        resize_by_quants
        download_attributes
        download_quants
        download_quals
        download_versions
      ].each do |table|
        copy_data(table)
      end
      populate_contextual_layers
      populate_profiles
      refresh_materialized_views
    end
  end
end

def refresh_materialized_views
  refresh_materialized_view('attributes_mv')
  refresh_materialized_view('map_attributes_mv')
  refresh_materialized_view('recolor_by_attributes_mv')
  refresh_materialized_view('resize_by_attributes_mv')
  refresh_materialized_view('download_attributes_mv')
end

def truncate_table(table)
  ActiveRecord::Base.connection.execute(
    "TRUNCATE revamp.#{table} CASCADE"
  )
end

def copy_data(table)
  puts "Copying table #{table}..."
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
  INSERT INTO revamp.countries (id, name, iso2, created_at, updated_at)
  SELECT country_id, name, iso2, NOW(), NOW()
  FROM public.countries;
  SQL
end

def country_properties_insert_sql
  <<-SQL
  INSERT INTO revamp.country_properties (country_id, latitude, longitude, zoom, created_at, updated_at)
  SELECT country_id, latitude, longitude, zoom, NOW(), NOW()
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
  INSERT INTO revamp.contexts (id, country_id, commodity_id, created_at, updated_at)
  SELECT
    id, country_id, commodity_id,
    NOW(), NOW()
  FROM public.context;
  SQL
end

def context_properties_insert_sql
  <<-SQL
  INSERT INTO revamp.context_properties (context_id, years, default_year, default_basemap, is_disabled, is_default, created_at, updated_at)
  SELECT
    id, years, default_year, default_basemap,
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
  WITH inserted_context_node_types AS (
    INSERT INTO revamp.context_node_types (id, context_id, node_type_id, created_at, updated_at)
    SELECT id, context_id, node_type_id, NOW(), NOW()
    FROM public.context_nodes
  )
  INSERT INTO revamp.context_node_type_properties (context_node_type_id, column_group, column_position, is_default, is_geo_column, created_at, updated_at)
  SELECT
    id, column_group, column_position,
    COALESCE(is_default, FALSE),
    COALESCE(is_geo_column, FALSE),
    NOW(), NOW()
  FROM public.context_nodes cnt JOIN public.node_types nt ON cnt.node_type_id = nt.node_type_id;
  SQL
end

def nodes_insert_sql
  <<-SQL
  INSERT INTO revamp.nodes (id, node_type_id, name, geo_id, main_id, is_domestic_consumption, is_unknown, created_at, updated_at)
  SELECT
    node_id, node_type_id, name, geo_id, main_node_id,
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
  WITH inserted_quants AS (
    INSERT INTO revamp.quants (id, name, unit, created_at, updated_at)
    SELECT quant_id, name, unit, NOW(), NOW() FROM public.quants
  )
  INSERT INTO revamp.quant_properties (quant_id, display_name, unit_type, tooltip_text, is_visible_on_actor_profile, is_visible_on_place_profile, is_temporal_on_actor_profile, is_temporal_on_place_profile, created_at, updated_at)
  SELECT quant_id, COALESCE(frontend_name, name), unit_type, tooltip_text, COALESCE(actor_factsheet, false), COALESCE(place_factsheet, false), COALESCE(actor_factsheet_temporal, false), COALESCE(place_factsheet_temporal, false), NOW(), NOW()
  FROM public.quants
  SQL
end

def inds_insert_sql
  <<-SQL
  WITH inserted_inds AS (
    INSERT INTO revamp.inds (id, name, unit, created_at, updated_at)
    SELECT ind_id, name, unit, NOW(), NOW() FROM public.inds
  )
  INSERT INTO revamp.ind_properties (ind_id, display_name, unit_type, tooltip_text, is_visible_on_actor_profile, is_visible_on_place_profile, is_temporal_on_actor_profile, is_temporal_on_place_profile, created_at, updated_at)
  SELECT ind_id, COALESCE(frontend_name, name), unit_type, tooltip_text, COALESCE(actor_factsheet, false), COALESCE(place_factsheet, false), COALESCE(actor_factsheet_temporal, false), COALESCE(place_factsheet_temporal, false), NOW(), NOW()
  FROM public.inds
  SQL
end

def quals_insert_sql
  <<-SQL
  WITH inserted_quals AS (
    INSERT INTO revamp.quals (id, name, created_at, updated_at)
    SELECT qual_id, name, NOW(), NOW() FROM public.quals
  )
  INSERT INTO revamp.qual_properties (qual_id, display_name, tooltip_text, is_visible_on_actor_profile, is_visible_on_place_profile, is_temporal_on_actor_profile, is_temporal_on_place_profile, created_at, updated_at)
  SELECT qual_id, COALESCE(frontend_name, name), tooltip_text, COALESCE(actor_factsheet, false), COALESCE(place_factsheet, false), COALESCE(actor_factsheet_temporal, false), COALESCE(place_factsheet_temporal, false), NOW(), NOW()
  FROM public.quals
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
  INSERT INTO revamp.download_attributes(id, context_id, position, display_name, years, created_at, updated_at)
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

def download_versions_insert_sql
  <<-SQL
  INSERT INTO revamp.download_versions(context_id, symbol, is_current, created_at, updated_at)
  SELECT
    context_id, symbol, COALESCE(current, FALSE), NOW(), NOW()
  FROM public.download_versions
  SQL
end

def populate_contextual_layers
  truncate_table('contextual_layers')
  truncate_table('carto_layers')
  brazil_soy = fetch_brazil_soy_context
  return unless brazil_soy.present?
  @pg_decoder = PG::TextDecoder::Array.new name: 'TEXT[]', delimiter: ','
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
    next unless inserted_cl.present?
    cl[:carto_layers].each do |clv|
      ActiveRecord::Base.connection.execute(
        "INSERT INTO revamp.carto_layers (contextual_layer_id, identifier, created_at, updated_at) VALUES (#{inserted_cl['id']}, '#{clv[:identifier]}', NOW(), NOW())"
      )
    end
  end

  def populate_profiles
    truncate_table('profiles')
    brazil_soy = fetch_brazil_soy_context
    return unless brazil_soy.present?

    actor_profile = {
      name: 'actor',
      charts: [
        {
          position: 0, identifier: 'top_countries', title: 'Top destination countries',
          attributes: [
            {position: 0, quant: 'Volume'}
          ]
        },
        {
          position: 1, identifier: 'top_sources', title: 'Top sourcing regions',
          attributes: [
            {position: 0, quant: 'Volume'}
          ]
        },
        {
          position: 2, identifier: 'sustainability', title: 'Deforestation risk associated with top sourcing regions',
          attributes: [
            {position: 0, quant: 'DEFORESTATION_V2'},
            {position: 1, quant: 'POTENTIAL_SOY_DEFORESTATION_V2'},
            {position: 2, quant: 'AGROSATELITE_SOY_DEFOR_'}
          ]
        },
        {
          position: 3, identifier: 'companies_sourcing', title: 'Comparing companies',
          attributes: [
            {position: 0, quant: 'LAND_USE'},
            {position: 1, quant: 'DEFORESTATION_V2'},
            {position: 2, quant: 'POTENTIAL_SOY_DEFORESTATION_V2'}
          ]
        }
      ]
    }

    importer_context_node_type = fetch_context_node_type(brazil_soy['id'], NodeTypeName::IMPORTER)
    exporter_context_node_type = fetch_context_node_type(brazil_soy['id'], NodeTypeName::EXPORTER)
    [importer_context_node_type, exporter_context_node_type].each do |cnt|
      inserted_profile = ActiveRecord::Base.connection.execute(
        "INSERT INTO revamp.profiles (name, context_node_type_id, created_at, updated_at) VALUES ('actor', #{cnt['id']}, NOW(), NOW()) RETURNING id"
      ).first
      actor_profile[:charts].each do |chart|
        insert_chart(inserted_profile['id'], nil, chart)
      end
    end

    place_profile = {
      name: 'place',
      charts: [
        {
          position: 0, identifier: 'indicators', title: 'Sustainability indicators',
          charts: [
            {
              position: 0, identifier: 'environmental_indicators', title: 'Environmental indicators',
              attributes: [
                {position: 0, quant: 'DEFORESTATION_V2'},
                {position: 1, quant: 'POTENTIAL_SOY_DEFORESTATION_V2'},
                {position: 2, quant: 'AGROSATELITE_SOY_DEFOR_'},
                {position: 3, quant: 'GHG_'},
                {position: 4, ind: 'WATER_SCARCITY'},
                {position: 5, quant: 'BIODIVERSITY'}
              ]
            },
            {
              position: 1, identifier: 'socioeconomic_indicators', title: 'Socio-economic indicators',
              attributes: [
                {position: 0, ind: 'HDI'},
                {position: 1, ind: 'GDP_CAP'},
                {position: 2, ind: 'PERC_FARM_GDP_'},
                {position: 3, ind: 'SMALLHOLDERS'},
                {position: 4, quant: 'SLAVERY'},
                {position: 5, quant: 'LAND_CONFL'},
                {position: 6, quant: 'POPULATION'}
              ]
            },
            {
              position: 2, identifier: 'agricultural_indicators', title: 'Agricultural indicators',
              attributes: [
                {position: 0, quant: 'SOY_TN'},
                {position: 1, ind: 'SOY_YIELD'},
                {position: 2, ind: 'SOY_AREAPERC'}
              ]
            },
            {
              position: 3, identifier: 'territorial_governance', title: 'Territorial governance',
              attributes: [
                {position: 0, quant: 'APP_DEFICIT_AREA'},
                {position: 1, quant: 'LR_DEFICIT_AREA'},
                {position: 2, ind: 'PROTECTED_DEFICIT_PERC'},
                {position: 3, quant: 'EMBARGOES_'}
              ]
            }
          ]
        },
        {
          position: 1, identifier: 'trajectory_deforestation', title: 'Deforestation trajectory',
          attributes: [
            {position: 0, quant: 'AGROSATELITE_SOY_DEFOR_'},
            {position: 1, quant: 'DEFORESTATION_V2'}
          ]
        },
        {
          position: 2, identifier: 'top_traders', title: 'Top traders',
          attributes: [
            {position: 0, quant: 'Volume'}
          ]
        },
        {
          position: 3, identifier: 'top_consumers', title: 'Top importer countries',
          attributes: [
            {position: 0, quant: 'Volume'}
          ]
        }
      ]
    }

    municipality_context_node_type = fetch_context_node_type(brazil_soy['id'], NodeTypeName::MUNICIPALITY)
    [municipality_context_node_type].each do |cnt|
      inserted_profile = ActiveRecord::Base.connection.execute(
        "INSERT INTO revamp.profiles (name, context_node_type_id, created_at, updated_at) VALUES ('place', #{cnt['id']}, NOW(), NOW()) RETURNING id"
      ).first
      place_profile[:charts].each do |chart|
        insert_chart(inserted_profile['id'], nil, chart)
      end
    end
  end
end

def fetch_brazil_soy_context
  query = <<-SQL
      SELECT c.id, default_context_layers
      FROM context c
      JOIN revamp.countries ctry ON ctry.id = c.country_id
      JOIN revamp.commodities comm ON comm.id = c.commodity_id
      WHERE ctry.iso2 = 'BR' AND comm.name = 'SOY'
    SQL
  ActiveRecord::Base.connection.execute(query).first
end

def fetch_context_node_type(context_id, name)
  query = <<-SQL
    SELECT cn.id
    FROM context_nodes cn
    JOIN revamp.node_types nt ON nt.id = cn.node_type_id
    WHERE context_id = #{context_id} AND nt.name = '#{name}'
    SQL
  ActiveRecord::Base.connection.execute(query).first
end

def fetch_quant(name)
  ActiveRecord::Base.connection.execute("SELECT id FROM revamp.quants WHERE name = '#{name}'").first
end

def fetch_ind(name)
  ActiveRecord::Base.connection.execute("SELECT id FROM revamp.inds WHERE name = '#{name}'").first
end

def insert_chart(profile_id, parent_chart_id, data)
  inserted_chart = ActiveRecord::Base.connection.execute(
    "INSERT INTO revamp.charts (profile_id, parent_id, identifier, title, position, created_at, updated_at) VALUES (#{profile_id}, #{parent_chart_id || 'NULL'}, '#{data[:identifier]}', '#{data[:title]}', #{data[:position]}, NOW(), NOW()) RETURNING id"
  ).first
  data[:attributes]&.each do |attribute|
    inserted_chart_attribute = ActiveRecord::Base.connection.execute(
      "INSERT INTO revamp.chart_attributes (chart_id, position, created_at, updated_at) VALUES (#{inserted_chart['id']}, #{attribute[:position]}, NOW(), NOW()) RETURNING id"
    ).first
    if attribute[:quant]
      quant_id = fetch_quant(attribute[:quant])['id']
      ActiveRecord::Base.connection.execute(
        "INSERT INTO revamp.chart_quants (chart_attribute_id, quant_id, created_at, updated_at) VALUES (#{inserted_chart_attribute['id']}, #{quant_id}, NOW(), NOW())"
      )
    elsif attribute[:ind]
      ind_id = fetch_ind(attribute[:ind])['id']
      ActiveRecord::Base.connection.execute(
        "INSERT INTO revamp.chart_inds (chart_attribute_id, ind_id, created_at, updated_at) VALUES (#{inserted_chart_attribute['id']}, #{ind_id}, NOW(), NOW())"
      )
    end
  end
  data[:charts]&.each do |chart|
    insert_chart(profile_id, inserted_chart['id'], chart)
  end
end
