require "#{Rails.root}/lib/cache/cleaner.rb"

# Downloads dump from S3 and restores to current database
module Api
  module V3
    module DatabaseImport
      class Importer
        IMPORT_DIR = 'tmp/import'.freeze
        INSTANCE_NAME = ENV['INSTANCE_NAME']

        def initialize(s3_filename)
          raise 'Invalid S3 object name' unless s3_filename.match?(/\w+\/.+\.dump\.gz/)
          @s3_filename = s3_filename
          @filename = s3_filename.split('/').last
          @local_filename = IMPORT_DIR + '/' + @filename
        end

        # @param options [Hash]
        # @option options [Boolean] :force
        def call(options = {})
          Rails.logger.debug "Starting import #{@s3_filename}"
          FileUtils.mkdir_p(IMPORT_DIR) unless File.directory?(IMPORT_DIR)

          download_from_s3(options)
          Rails.logger.debug 'Download completed'

          restore(options)

          Cache::Cleaner.clear_all
        ensure
          FileUtils.rm_f Dir.glob("#{IMPORT_DIR}/*") if dir_exists?
        end

        private

        def download_from_s3(options = {})
          metadata = S3::Downloader.instance.call(@s3_filename, @local_filename)
          Rails.logger.debug 'Database downloaded'
          schema_version = ActiveRecord::Migrator.current_version.to_s
          schema_match = (metadata['schema_version'] == schema_version)
          return if options[:force] || schema_match
          raise "Incompatible schema version #{metadata['schema_version']}, \
cannot restore"
        end

        def restore(options = {})
          exporter = Api::V3::DatabaseExport::Exporter.new
          exporter.call(
            keep_local_copy: true
          )
          backup_local_filename = exporter.local_filename
          config = Rails.configuration.database_configuration
          env_config = config[Rails.env]
          active_db_name = env_config['database']
          pg_tasks = ActiveRecord::Tasks::PostgreSQLDatabaseTasks.new(env_config)
          begin
            pg_tasks.purge if options[:force]
            pg_tasks.data_restore(@local_filename, active_db_name)
            Rails.logger.debug 'Database restored to new version'
          rescue
            # restore database to previous version using local backup
            pg_tasks.data_restore(backup_local_filename, active_db_name)
            Rails.logger.debug 'Database restored to previous version'
            raise
          end
        end

        def dir_exists?
          File.directory?(IMPORT_DIR)
        end
      end
    end
  end
end
