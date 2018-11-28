# Downloads schema dump from S3 and restores to current database
module Api
  module V3
    module DatabaseImport
      class SchemaImporter < Importer
        private

        def initialize(s3_name)
          super
          prepare_schema
        end

        def download_from_s3(_options = {})
          Api::V3::S3Downloader.instance.call(@s3_filename, @local_filename)
          Rails.logger.debug 'Schema downloaded'
        end

        def prepare_schema
          mirror_schema = ENV['TRASE_LOCAL_MIRROR_SCHEMA']
          ActiveRecord::Base.connection.execute(
            <<~SQL
              DROP SCHEMA IF EXISTS #{mirror_schema} CASCADE;
              CREATE SCHEMA #{mirror_schema};
            SQL
          )
        end
      end
    end
  end
end
