module Api
  module V3
    module Download
      class StreamContentForCsv < StreamContent
        private

        def write_data_entry(query, stream_writer)
          csv = PgCsv.new(
            type: :stream,
            sql: query.to_sql,
            header: true,
            delimiter: @download.separator,
            encoding: 'UTF8',
            logger: Rails.logger
          )
          csv.export(stream_writer)
        end

        def format
          'csv'
        end
      end
    end
  end
end
