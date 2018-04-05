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
          Api::V3::Download::ZippedCsvDownload.new(
            @query, @download_name, @separator
          ).create
        end

        def zipped_json
          Api::V3::Download::ZippedJsonDownload.new(
            @query, @download_name
          ).create
        end
      end
    end
  end
end
