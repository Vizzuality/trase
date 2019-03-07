require 'rails_helper'

RSpec.describe Api::V3::Download::ZippedCsvDownload do
  include_context 'api v3 brazil two flows'
  include ZipHelpers

  before do
    allow(
      Api::V3::Download::PrecomputedDownload
    ).to receive(:refresh)
  end

  before(:each) do
    Api::V3::Readonly::DownloadFlow.refresh(sync: true)
  end

  let(:query) {
    Api::V3::Readonly::DownloadFlow.where(context_id: api_v3_context.id)
  }

  let(:flat_query) {
    Api::V3::Download::FlowDownloadFlatQuery.new(api_v3_context, query)
  }

  let(:pivot_query) {
    Api::V3::Download::FlowDownloadPivotQuery.new(api_v3_context, query)
  }

  let(:flat_download) {
    Api::V3::Download::ZippedCsvDownload.new(flat_query, 'test', ',')
  }

  let(:pivot_download) {
    Api::V3::Download::ZippedCsvDownload.new(pivot_query, 'test', ',')
  }

  describe :create do
    before(:each) do
      allow_any_instance_of(
        Api::V3::Download::PrecomputedDownload
      ).to receive(:store).and_return('')
    end

    context 'when max rows not exceeded' do
      it 'doesn\'t chunk flat data files' do
        filenames = unzip(flat_download.create).keys
        csv_files = filenames.select { |f| f.match(/\.csv$/) }
        expect(csv_files.first).to eq('test.csv')
      end

      it 'doesn\'t chunk pivot data files' do
        filenames = unzip(pivot_download.create).keys
        csv_files = filenames.select { |f| f.match(/\.csv$/) }
        expect(csv_files.first).to eq('test.csv')
      end
    end

    context 'when max rows exceeded' do
      before(:each) do
        stub_const('Api::V3::Download::ZippedDownload::MAX_SIZE', 1)
      end

      it 'chunks flat data files' do
        filenames = unzip(flat_download.create).keys
        csv_files = filenames.select { |f| f.match(/\.csv$/) }
        expect(csv_files.first).to eq('test.2015.csv')
      end

      it 'chunks pivot data files' do
        filenames = unzip(pivot_download.create).keys
        csv_files = filenames.select { |f| f.match(/\.csv$/) }
        expect(csv_files.first).to eq('test.2015.csv')
      end
    end
  end
end
