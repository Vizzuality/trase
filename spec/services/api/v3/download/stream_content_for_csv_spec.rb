require 'rails_helper'

RSpec.describe Api::V3::Download::StreamContentForCsv do
  include_context 'api v3 brazil two flows'
  include ZipHelpers

  before(:all) {
    FileUtils.mkdir_p 'spec/support/downloads/csv'
    FileUtils.mkdir_p 'spec/support/downloads/json'
  }

  after(:all) {
    FileUtils.rm_rf 'spec/support/downloads'
  }

  before(:each) {
    stub_const(
      'Api::V3::Download::PrecomputedDownload::ROOT_DIRNAME',
      'spec/support/downloads'
    )

    Api::V3::Readonly::Attribute.refresh(skip_dependencies: true, skip_dependents: true)
    Api::V3::Readonly::DownloadAttribute.refresh(skip_dependencies: true, skip_dependents: true)
    Api::V3::TablePartitions::CreatePartitionsForDenormalisedFlowQuants.new.call
    Api::V3::TablePartitions::CreatePartitionsForDenormalisedFlowQuals.new.call
    Api::V3::Readonly::DownloadFlowsStats.refresh(skip_dependencies: true, skip_dependents: true)
  }

  let(:flat_download) {
    Api::V3::Download::FlowDownload.new(api_v3_context, pivot: false)
  }
  let(:pivot_download) {
    Api::V3::Download::FlowDownload.new(api_v3_context, pivot: true)
  }

  let(:flat_zip_file_path) {
      [
        Api::V3::Download::PrecomputedDownload::ROOT_DIRNAME,
        'csv',
        'flat_download.zip'
      ].join('/')
  }
  let(:pivot_zip_file_path) {
      [
        Api::V3::Download::PrecomputedDownload::ROOT_DIRNAME,
        'csv',
        'pivot_download.zip'
      ].join('/')
  }

  def create_flat_zip_file
    out = File.new(flat_zip_file_path, 'wb')
    ZipTricks::Streamer.open(out) do |stream|
      Api::V3::Download::StreamContentForCsv.new(flat_download).call(stream)
    end
    out.close
  end

  def create_pivot_zip_file
    out = File.new(pivot_zip_file_path, 'wb')
    ZipTricks::Streamer.open(out) do |stream|
      Api::V3::Download::StreamContentForCsv.new(pivot_download).call(stream)
    end
    out.close
  end

  describe :call do
    context 'when max rows not exceeded' do
      it 'doesn\'t chunk flat data files' do
        create_flat_zip_file
        filenames = zip_file_entries_filenames(flat_zip_file_path)
        csv_files = filenames.select { |f| f.match(/\.csv$/) }
        expect(csv_files.first).to eq('BRAZIL_SOY_tc.csv')
      end

      it 'doesn\'t chunk pivot data files' do
        create_pivot_zip_file
        filenames = zip_file_entries_filenames(pivot_zip_file_path)
        csv_files = filenames.select { |f| f.match(/\.csv$/) }
        expect(csv_files.first).to eq('BRAZIL_SOY_pc.csv')
      end
    end

    context 'when max rows exceeded' do
      before(:each) do
        stub_const('Api::V3::Download::FlowDownloadFlatQuery::MAX_SIZE', 1)
      end

      it 'chunks flat data files' do
        create_flat_zip_file
        filenames = zip_file_entries_filenames(flat_zip_file_path)
        csv_files = filenames.select { |f| f.match(/\.csv$/) }
        expect(csv_files.first).to eq('BRAZIL_SOY_tc.2015.csv')
      end

      it 'chunks pivot data files' do
        create_pivot_zip_file
        filenames = zip_file_entries_filenames(pivot_zip_file_path)
        csv_files = filenames.select { |f| f.match(/\.csv$/) }
        expect(csv_files.first).to eq('BRAZIL_SOY_pc.2015.csv')
      end
    end
  end
end
