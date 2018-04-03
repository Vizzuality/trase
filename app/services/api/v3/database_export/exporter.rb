# Dumps current database and uploads to S3
module Api
  module V3
    module DatabaseExport
      class Exporter
        EXPORT_DIR = 'tmp/export'.freeze
        INSTANCE_NAME = ENV['INSTANCE_NAME']
        attr_reader :local_filename

        def initialize
          @filename = Time.now.strftime('%Y%m%d-%H:%M:%S%:z') + '.dump.gz'
          @local_filename = EXPORT_DIR + '/' + @filename
          @s3_filename = INSTANCE_NAME + '/' + @filename
        end

        # @param options [Hash]
        # @option options [symbol] :keep_local_copy
        def call(options = {})
          FileUtils.mkdir_p(EXPORT_DIR) unless dir_exists?
          keep_local_copy = options[:keep_local_copy]

          dump(local_filename)
          upload_to_s3(@s3_filename, @local_filename)
        ensure
          if !keep_local_copy && dir_exists?
            FileUtils.rm_f Dir.glob("#{EXPORT_DIR}/*")
          end
        end

        private

        def dump(local_filename)
          config = Rails.configuration.database_configuration
          env_config = config[Rails.env]
          pg_tasks = ActiveRecord::Tasks::PostgreSQLDatabaseTasks.new(env_config)
          pg_tasks.data_dump(local_filename)
          Rails.logger.debug 'Database dumped'
          local_filename
        end

        def upload_to_s3(s3_filename, local_filename)
          Api::V3::S3Uploader.instance.call(
            s3_filename,
            local_filename,
            schema_version: ActiveRecord::Migrator.current_version.to_s
          )
          Rails.logger.debug 'Database uploaded'
        end

        def dir_exists?
          File.directory?(EXPORT_DIR)
        end
      end
    end
  end
end
