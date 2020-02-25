module Api
  module V3
    module Download
      class StreamContentForJson < StreamContent
        private

        def write_data_entry(query, stream_writer)
          json_query = Api::V3::Flow.
            select('array_to_json(array_agg(row_to_json(t)))').
            from("(#{query.to_sql}) t")
          result = Api::V3::Flow.connection.
            execute(json_query.to_sql)
          stream_writer << result.getvalue(0, 0)
        end

        def format
          'json'
        end
      end
    end
  end
end
