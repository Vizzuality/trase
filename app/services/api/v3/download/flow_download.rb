module Api
  module V3
    module Download
      class FlowDownload
        delegate :download_name, to: :@parameters
        delegate :filename, to: :@parameters
        delegate :separator, to: :@parameters
        attr_reader :query

        def initialize(context, params)
          @parameters = Api::V3::Download::Parameters.new(context, params)
          query_builder = Api::V3::Download::FlowDownloadQueryBuilder.new(
            context, @parameters.filters
          )
          @query = if @parameters.pivot
                     query_builder.pivot_query
                   else
                     query_builder.flat_query
                   end
        end
      end
    end
  end
end
