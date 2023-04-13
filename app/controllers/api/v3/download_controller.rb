module Api
  module V3
    class DownloadController < ApiController
      include ZipTricks::RailsStreaming

      def index
        set_no_cache_headers
        parameters = Api::V3::Download::Parameters.new(@context, params)
        precomputed_download =
          Api::V3::Download::RetrievePrecomputedDownload.new(parameters)

        if precomputed_download.exists?
          # TODO: could this somehow just be served by Apache if it exists
          serve_precomputed_download(precomputed_download)
        else
          set_streamed_zip_file_headers(parameters.filename)
          stream_generated_download
        end
      end

      private

      def serve_precomputed_download(precomputed_download)
        send_file precomputed_download.call,
                  type: "application/zip",
                  filename: precomputed_download.filename,
                  disposition: "attachment"
      end

      def stream_generated_download
        download = Api::V3::Download::FlowDownload.new(@context, params)
        content_streamer =
          if request.format.json?
            Api::V3::Download::StreamContentForJson.new(download)
          else
            Api::V3::Download::StreamContentForCsv.new(download)
          end

        zip_tricks_stream do |stream|
          content_streamer.call(stream)
        end
      end

      def set_no_cache_headers
        response.headers["Cache-Control"] = "no-cache"
        response.headers["Last-Modified"] = Time.now.httpdate.to_s
      end

      # rubocop:disable Naming/AccessorMethodName
      def set_streamed_zip_file_headers(filename)
        response.headers["Content-Disposition"] =
          "attachment; filename=\"#{filename}\""
        response.headers["Content-Type"] = "application/zip"
        response.delete_header("Content-Length")
        response.headers["X-Accel-Buffering"] = "no"
      end
      # rubocop:enable Naming/AccessorMethodName

      # override to allow parametrisation be either context_id
      # or country_is & commodity_id
      def load_context
        if params[:context_id]
          @context = Api::V3::Context.find(params[:context_id])
          return
        end
        if params[:country_id] && params[:commodity_id]
          @context = Api::V3::Context.find_by(
            country_id: params[:country_id], commodity_id: params[:commodity_id]
          )
          return
        end
        ensure_required_param_present(:context_id)
      end
    end
  end
end
