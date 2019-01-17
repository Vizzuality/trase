require 'db_helpers/search_path_helpers.rb'
require 'db_helpers/comment_helpers.rb'
include SearchPathHelpers
include CommentHelpers

namespace :db do
  namespace :doc do
    desc 'Update sql comments on schema objects and dump new structure.sql'
    task sql: [:environment] do
      data = YAML.safe_load(File.open("#{Rails.root}/db/schema_comments.yml"))

      data['tables'].each do |table|
        comment_on_table(table['name'], table['comment'])
        table['columns']&.each do |column|
          comment_on_column(table['name'], column['name'], column['comment'] || '')
        end
        table['indexes']&.each do |index|
          comment_on_index(index['name'], index['comment'])
        end
      end
      data['materialized_views'].each do |table|
        comment_on_materialized_view(table['name'], table['comment'])
        table['columns']&.each do |column|
          comment_on_column(table['name'], column['name'], column['comment'] || '')
        end
      end

      Rake::Task['db:structure:dump'].invoke
    end

    POSTGRESQL_JAR = 'postgresql-42.2.5.jar'.freeze
    SCHEMA_SPY_JAR = 'schemaspy-6.0.0.jar'.freeze
    BLUE_TABLES = %w[
      countries
      commodities
      contexts
      context_node_types
      download_versions
      nodes
      inds
      quals
      quants
      node_inds
      node_quals
      node_quants
      flow_inds
      flow_quals
      flow_quants
    ].freeze

    desc 'Generate html schema documentation'
    task html: [:sql] do
      exec `cd doc/db; java -jar #{SCHEMA_SPY_JAR} -t pgsql -dp #{POSTGRESQL_JAR} -db trase_revamp -s public -u postgres -host localhost -o ./all_tables`
      exec `cd doc/db; java -jar #{SCHEMA_SPY_JAR} -t pgsql -dp #{POSTGRESQL_JAR} -db trase_revamp -s public -u postgres -host localhost -i "#{BLUE_TABLES.join('|')}" -o ./blue_tables`
    end
  end
end
