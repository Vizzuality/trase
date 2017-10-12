namespace :db do
  namespace :revamp do
    desc 'Copy data from public schema into revamp schema'
    task copy: [:environment] do
      [
        'countries',
        'commodities',
        'contexts'
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
