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
          Api::V3::MapAttributesCartoUpload.new(@carto_name, column_names, @local_filename).call
        end
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

      def column_names
        sql = <<~SQL
          SELECT c.column_name
          FROM information_schema.tables t
          LEFT JOIN information_schema.columns c ON t.table_schema = c.table_schema AND t.table_name = c.table_name
          WHERE table_type = 'VIEW' AND t.table_name = 'map_attributes_values_v'
        SQL
        result = Api::V3::Readonly::MapAttribute.connection.execute sql
        result.values.flatten
      end

      def dir_exists?
        File.directory?(EXPORT_DIR)
      end
    end
  end
end
