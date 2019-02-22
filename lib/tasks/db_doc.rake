require 'db_helpers/search_path_helpers.rb'
require 'db_helpers/comment_helpers.rb'
require 'English'
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
    LIB_DIR = 'doc/db'.freeze
    OUTPUT_DIR = 'doc/db/gh-pages'.freeze

    desc 'Generate html schema documentation'
    task html: [:sql] do
      config = Rails.configuration.database_configuration
      run_schema_spy(config, 'all_tables', 'public')
      run_schema_spy(config, 'blue_tables', 'public', BLUE_TABLES)
    end

    def run_schema_spy(config, output_name, schema_name, tables = nil)
      schema_spy_options = [
        "-jar #{LIB_DIR}/#{SCHEMA_SPY_JAR}",
        '-t pgsql',
        "-dp #{LIB_DIR}/#{POSTGRESQL_JAR}",
        "-db #{config[Rails.env]['database']}",
        "-u #{config[Rails.env]['username']}",
        "-host #{config[Rails.env]['host']}",
        "-o ./#{OUTPUT_DIR}/#{output_name}"
      ]
      schema_spy_options << "-s #{schema_name}" if schema_name
      schema_spy_options << "-i \"#{tables.join('|')}\"" if tables
      system("java #{schema_spy_options.join(' ')}")
    end

    desc 'Generate html schema documentation and push to GH pages'
    task html_2_gh_pages: [:html, :gh_pages]

    desc 'Generate html schema documentation and push to GH pages'
    task gh_pages: [:environment] do
      run_gh_pages_update
    end

    def run_gh_pages_update
      tmp_dir = 'tmp-gh-pages'
      repo_name = 'trase'

      # get current revision (this assumes we've just pushed to develop)"
      revision = `git rev-parse HEAD`.chomp
      raise('Cannot read current revision') unless revision

      [
        "mkdir -p #{tmp_dir}",
        # clone gh pages branch
        "cd #{tmp_dir}; git clone --depth=1 --branch=gh-pages git@github.com:Vizzuality/#{repo_name}.git",
        # copy html files (this assumes we've just regenerated them)
        "cp -a #{OUTPUT_DIR}/ #{tmp_dir}/#{repo_name}/",
        # push to gh-pages
        "cd #{tmp_dir}/#{repo_name}; git add .; git commit -m \"Update #{revision}\"; git push origin gh-pages"
      ].each do |cmd|
        puts "#{Time.now.strftime('%Y%m%d-%H:%M:%S%:z')}: #{cmd}"
        system(cmd)
        raise('Updating gh-pages failed') unless $CHILD_STATUS.success?
      end
    ensure
      `rm -rf #{tmp_dir}` if File.directory?(tmp_dir)
    end
  end
end
