module Api
  module V3
    class DownloadController < ApiController
      def index
        download = Api::V3::Download::FlowDownload.new(@context, params)

        respond_to do |format|
          format.csv do
            send_data download.zipped_csv,
                      type: 'application/zip',
                      filename: "#{download.download_name}.zip",
                      disposition: 'attachment'
          end
          format.json do
            send_data download.zipped_json,
                      type: 'application/zip',
                      filename: "#{download.download_name}.zip",
                      disposition: 'attachment'
          end
        end
      end
    end
  end
end
