class RemoveOldTables < ActiveRecord::Migration[5.1]
  def change
    old_tables.each do |table|
      execute "DROP TABLE IF EXISTS public.#{table} CASCADE"
    end
    old_materialized_views.each do |materialized_view|
      execute "DROP MATERIALIZED VIEW public.#{materialized_view}"
    end
    old_functions.each do |function|
      execute "DROP FUNCTION #{function}"
    end
    execute 'DROP TYPE attribute_type'
    new_tables.each do |table|
      execute "ALTER TABLE revamp.#{table} SET SCHEMA public"
    end
    new_materialized_views.each do |materialized_view|
      execute "ALTER MATERIALIZED VIEW revamp.#{materialized_view} SET SCHEMA public"
    end
    new_functions.each do |function|
      execute "ALTER FUNCTION revamp.#{function} SET SCHEMA public"
    end
    execute 'DROP SCHEMA revamp'
  end

  def old_tables
    tables_in_schema('public')
  end

  def old_materialized_views
    materialized_views_in_schema('public')
  end

  def old_functions
    [
      'add_soy_()',
      'fix_zd()',
      'get_trader_sum(integer,integer)',
    ]
  end

  def new_tables
    tables_in_schema('revamp')
  end

  def new_materialized_views
    materialized_views_in_schema('revamp')
  end

  def new_functions
    [
      'bucket_index(double precision[],double precision)'
    ]
  end

  def tables_in_schema(schema_name)
    sql = <<~SQL
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = '#{schema_name}'
      AND table_name NOT IN ('schema_migrations', 'ar_internal_metadata')
    SQL
    result = execute sql
    result.map { |row| row['table_name'] }
  end

  def materialized_views_in_schema(schema_name)
    sql = <<-SQL
      SELECT matviewname FROM pg_matviews
      WHERE schemaname = '#{schema_name}'
    SQL
    result = execute sql
    result.map { |row| row['matviewname'] }
  end
end
