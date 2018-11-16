require 'rails_helper'

RSpec.describe Api::V3::Download::FlowDownload do
  include_context 'api v3 brazil two flows'

  before(:each) do
    Api::V3::Readonly::DownloadFlow.refresh(sync: true)
  end

  let(:flow_download_flat) {
    Api::V3::Download::FlowDownload.new(api_v3_context, {separator: :semicolon})
  }

  let(:flow_download_pivot) {
    Api::V3::Download::FlowDownload.new(api_v3_context, {pivot: :true})
  }

  describe :zipped_csv do
    it 'creates an instance of Api::V3::Download::ZippedCsvDownload for flat csv' do
      expect_any_instance_of(Api::V3::Download::ZippedCsvDownload).to receive(:create)
      flow_download_flat.zipped_csv
    end

    it 'creates an instance of Api::V3::Download::ZippedCsvDownload for pivot csv' do
      expect_any_instance_of(Api::V3::Download::ZippedCsvDownload).to receive(:create)
      flow_download_pivot.zipped_csv
    end
  end

  describe :zipped_json do
    it 'creates an instance of Api::V3::Download::ZippedCsvDownload for flat json' do
      expect_any_instance_of(Api::V3::Download::ZippedJsonDownload).to receive(:create)
      flow_download_flat.zipped_json
    end

    it 'creates an instance of Api::V3::Download::ZippedCsvDownload for pivot json' do
      expect_any_instance_of(Api::V3::Download::ZippedJsonDownload).to receive(:create)
      flow_download_pivot.zipped_json
    end
  end
end
