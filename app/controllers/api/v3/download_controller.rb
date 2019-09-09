module Api
  module V3
    class DownloadController < ApiController
      before_action :set_no_cache_headers

      def index
        download = Api::V3::Download::FlowDownload.new(@context, params)

        respond_to do |format|
          format.csv do
            send_data download.zipped_csv,
                      type: 'application/zip',
                      filename: download.filename,
                      disposition: 'attachment'
          end
          format.json do
            send_data download.zipped_json,
                      type: 'application/zip',
                      filename: download.filename,
                      disposition: 'attachment'
          end
        end
      end

      private

      def set_no_cache_headers
        response.delete_header('ETag')

        response.set_header('Pragma', 'no-cache')
        response.set_header('Expires', DateTime.yesterday)
        response.set_header(
          'Cache-Control',
          'max-age=0, no-store, no-cache, must-revalidate'
        )
      end
    end
  end
end
