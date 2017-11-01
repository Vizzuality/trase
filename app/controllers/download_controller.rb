class DownloadController < ApplicationController
  def index
    download = FlowDownload.new(@context, params)

    respond_to do |format|
      format.csv do
        send_file download.zipped_csv.path,
                  type: 'application/zip',
                  filename: "#{download.download_name}.zip",
                  disposition: 'attachment'
      end
      format.json do
        send_file download.zipped_json.path,
                  type: 'application/zip',
                  filename: "#{download.download_name}.zip",
                  disposition: 'attachment'
      end
    end
  end
end
