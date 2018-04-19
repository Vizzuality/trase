module Api
  module V3
    module Download
      class ZippedCsvDownload < ZippedDownload
        # @param (see ZippedDownload#initialize)
        # @param separator [String] csv separator
        def initialize(query, download_name, separator)
          super(query, download_name)
          @separator = separator
        end

        private

        def content(query)
          csv = PgCsv.new(
            sql: query.to_sql,
            header: true,
            delimiter: @separator,
            encoding: 'UTF8',
            type: :plain,
            logger: Rails.logger
          )
          csv.export
        end

        def format
          :csv
        end
      end
    end
  end
end
