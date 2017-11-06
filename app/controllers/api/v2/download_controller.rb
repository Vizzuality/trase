module Api
  module V2
    class DownloadController < ApiController
      def index
        download = FlowDownload.new(@context, params)

        respond_to do |format|
          format.csv {
            send_file download.zipped_csv.path,
                      type: 'application/zip',
                      filename: "#{download.download_name}.zip",
                      disposition: "attachment"
          }
          format.json {
            send_file download.zipped_json.path,
                      type: 'application/zip',
                      filename: "#{download.download_name}.zip",
                      disposition: "attachment"
          }
        end
      end
    end
  end
end
