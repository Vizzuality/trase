require 'fileutils'
require 'tempfile'
require 'zip'

module Api
  module V3
    module Download
      class FlowDownload
        attr_reader :download_name

        def initialize(context, params)
          @context = context
          @pivot = params[:pivot].present?
          @separator = if params[:separator].present? && params[:separator] == 'semicolon'
                         ';'
                       else
                         ','
                       end
          @download_name = [
            @context.country.name,
            @context.commodity.name,
            DownloadVersion.current_version_symbol(@context)
          ].compact.join('_')
          query_builder = Api::V3::Download::FlowDownloadQueryBuilder.new(@context, params)
          @query = if @pivot
                     query_builder.pivot_query
                   else
                     query_builder.flat_query
                   end
        end

        def zipped_csv
          csv = PgCsv.new(
            sql: @query.to_sql,
            header: true,
            delimiter: @separator,
            encoding: 'UTF8',
            type: :plain,
            logger: Rails.logger
          )
          content = csv.export
          # NOTE: exporting directly into file raises encoding errors
          filename = "#{@download_name}.csv"
          zipfile = Api::V3::Download::TempZipfile.new(@download_name)
          zipfile.add(content, filename)
        end

        def zipped_json
          json_query = Api::V3::Readonly::DownloadFlow.
            select('array_to_json(array_agg(row_to_json(t)))').
            from("(#{@query.to_sql}) t")
          result = Api::V3::Readonly::DownloadFlow.connection.
            execute(json_query.to_sql)
          content = result.getvalue(0,0)
          filename = "#{@download_name}.json"
          zipfile = Api::V3::Download::TempZipfile.new(@download_name)
          zipfile.add(content, filename)
        end
      end
    end
  end
end
