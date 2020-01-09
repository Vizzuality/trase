require 'rails_helper'

RSpec.describe Api::V3::Download::ZippedJsonDownload do
  include_context 'api v3 brazil two flows'
  include ZipHelpers

  before do
    allow(
      Api::V3::Download::PrecomputedDownload
    ).to receive(:refresh)
  end

  before(:each) do
    Api::V3::Readonly::Attribute.refresh(skip_dependencies: true, skip_dependents: true)
    Api::V3::Readonly::DownloadAttribute.refresh(skip_dependencies: true, skip_dependents: true)
    Api::V3::TablePartitions::CreatePartitionsForDenormalisedFlowQuants.new.call
    Api::V3::TablePartitions::CreatePartitionsForDenormalisedFlowQuals.new.call
    Api::V3::Readonly::DownloadFlowsStats.refresh(skip_dependencies: true, skip_dependents: true)
  end

  let(:query_builder) {
    Api::V3::Download::FlowDownloadQueryBuilder.new(api_v3_context, {})
  }

  let(:flat_query) {
    query_builder.flat_query
  }

  let(:pivot_query) {
    query_builder.pivot_query
  }

  let(:flat_download) {
    Api::V3::Download::ZippedJsonDownload.new(flat_query, 'test')
  }

  let(:pivot_download) {
    Api::V3::Download::ZippedJsonDownload.new(pivot_query, 'test')
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
        json_files = filenames.select { |f| f.match(/\.json$/) }
        expect(json_files.first).to eq('test.json')
      end

      it 'doesn\'t chunk pivot data files' do
        filenames = unzip(pivot_download.create).keys
        json_files = filenames.select { |f| f.match(/\.json$/) }
        expect(json_files.first).to eq('test.json')
      end
    end

    context 'when max rows exceeded' do
      before(:each) do
        stub_const('Api::V3::Download::FlowDownloadFlatQuery::MAX_SIZE', 1)
      end

      it 'chunks flat data files' do
        filenames = unzip(flat_download.create).keys
        json_files = filenames.select { |f| f.match(/\.json$/) }
        expect(json_files.first).to eq('test.2015.json')
      end

      it 'chunks pivot data files' do
        filenames = unzip(pivot_download.create).keys
        json_files = filenames.select { |f| f.match(/\.json$/) }
        expect(json_files.first).to eq('test.2015.json')
      end
    end
  end
end
