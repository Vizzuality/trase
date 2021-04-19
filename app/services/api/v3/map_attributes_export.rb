# This service is supposed to be started via a sidekiq worker following
# a database update.
# It exports values of node inds / quants in a CSV format to a location in S3.
module Api
  module V3
    class MapAttributesExport
      EXPORT_DIR = 'tmp/export'.freeze
      S3_PREFIX = 'SITE_CONTENT'.freeze

      def initialize
        @carto_name = "map_attributes_values_#{Rails.env.downcase}"
        @local_filename = EXPORT_DIR + '/' + @carto_name + '.csv.gz'
        @s3_filename = S3_PREFIX + '/' + Rails.env.upcase + '/' + @carto_name + '.csv.gz'
      end

      def call
        generate_csv
        unless Rails.env.development? || Rails.env.test?
          upload_to_s3
        end
      end

      def public_url
        S3::PublicUrl.instance.call(@s3_filename)
      end

      private

      def generate_csv
        FileUtils.mkdir_p(EXPORT_DIR) unless dir_exists?
        csv = PgCsv.new(
          type: :gzip,
          sql: 'SELECT * FROM map_attributes_values_v',
          header: true,
          delimiter: ',',
          encoding: 'UTF8',
          logger: Rails.logger
        )
        csv.export(@local_filename)
        Rails.logger.debug 'Map attributes values file generated'
      end

      def upload_to_s3
        meta = {
          schema_version: ActiveRecord::Migrator.current_version.to_s
        }
        last_successful_update = Api::V3::DatabaseUpdate.last_successful_update
        if last_successful_update
          meta = meta.merge({
            last_update: last_successful_update.created_at.to_s,
            filename: last_successful_update.filename || 'N/A'
          })
        end
        S3::Uploader.instance.call(@s3_filename, @local_filename, meta)
        Rails.logger.debug "File uploaded to #{@s3_filename}"
        # set canned ACL - public read, owner write
        S3::CannedAcl.instance.call(@s3_filename, 'public-read')
      end

      def dir_exists?
        File.directory?(EXPORT_DIR)
      end
    end
  end
end
