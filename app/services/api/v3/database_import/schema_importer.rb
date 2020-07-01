# Downloads schema dump from S3 and restores to current database
module Api
  module V3
    module DatabaseImport
      class SchemaImporter < Importer
        def initialize(s3_name)
          super
          prepare_schema
        end

        def cleanup
          mirror_schema = ENV['TRASE_LOCAL_MIRROR_SCHEMA']
          ActiveRecord::Base.connection.execute(
            "DROP SCHEMA IF EXISTS #{mirror_schema} CASCADE;"
          )
        end

        private

        def download_from_s3(_options = {})
          S3::Downloader.instance.call(@s3_filename, @local_filename)
          Rails.logger.debug 'Schema downloaded'
        end

        def prepare_schema
          cleanup
          mirror_schema = ENV['TRASE_LOCAL_MIRROR_SCHEMA']
          ActiveRecord::Base.connection.execute(
            "CREATE SCHEMA #{mirror_schema};"
          )
        end
      end
    end
  end
end
