module Api
  module V3
    module Download
      class ZippedJsonDownload < ZippedDownload
        def content
          json_query = Api::V3::Readonly::DownloadFlow.
            select('array_to_json(array_agg(row_to_json(t)))').
            from("(#{@query.to_sql}) t")
          result = Api::V3::Readonly::DownloadFlow.connection.
            execute(json_query.to_sql)
          result.getvalue(0, 0)
        end

        def filename
          "#{@download_name}.json"
        end
      end
    end
  end
end
