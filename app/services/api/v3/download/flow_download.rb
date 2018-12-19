module Api
  module V3
    module Download
      class FlowDownload
        delegate :download_name, to: :@parameters
        delegate :filename, to: :@parameters

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

        def zipped_csv
          precompute do
            Api::V3::Download::ZippedCsvDownload.new(
              @query, download_name, @separator
            ).create
          end
        end

        def zipped_json
          precompute do
            Api::V3::Download::ZippedJsonDownload.new(
              @query, download_name
            ).create
          end
        end

        def precompute
          if @parameters.precompute?
            precomputed_download = Api::V3::Download::PrecomputedDownload.new(
              @parameters
            )
          end

          data = precomputed_download&.retrieve
          return data if data

          Rails.logger.debug('Generating download')
          data = yield
          precomputed_download&.store(data)
          data
        end
      end
    end
  end
end
