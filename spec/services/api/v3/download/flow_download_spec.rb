require 'rails_helper'

RSpec.describe Api::V3::Download::FlowDownload do
  include_context 'api v3 brazil two flows'

  before do
    allow(
      Api::V3::Download::PrecomputedDownload
    ).to receive(:refresh)
    allow_any_instance_of(
      Api::V3::Download::PrecomputedDownload
    ).to receive(:store)
  end

  before(:each) do
    Api::V3::TablePartitions::CreatePartitionsForDenormalisedFlowQuants.new.call
  end

  let(:flow_download_flat) {
    Api::V3::Download::FlowDownload.new(api_v3_context, separator: :semicolon)
  }

  let(:flow_download_pivot) {
    Api::V3::Download::FlowDownload.new(api_v3_context, pivot: true)
  }

  describe :zipped_csv do
    context 'when no precomputed file' do
      before(:each) do
        allow_any_instance_of(
          Api::V3::Download::PrecomputedDownload
        ).to receive(:retrieve).and_return(nil)
      end

      it 'creates a file for flat csv' do
        expect_any_instance_of(
          Api::V3::Download::ZippedCsvDownload
        ).to receive(:create)
        flow_download_flat.zipped_csv
      end

      it 'creates a file for pivot csv' do
        expect_any_instance_of(
          Api::V3::Download::ZippedCsvDownload
        ).to receive(:create)
        flow_download_pivot.zipped_csv
      end
    end

    context 'when precomputed file' do
      before(:each) do
        allow_any_instance_of(
          Api::V3::Download::PrecomputedDownload
        ).to receive(:retrieve).and_return('')
      end

      it 'does not create a file for flat csv' do
        expect_any_instance_of(
          Api::V3::Download::ZippedCsvDownload
        ).not_to receive(:create)
        flow_download_flat.zipped_csv
      end

      it 'does not create a file for pivot csv' do
        expect_any_instance_of(
          Api::V3::Download::ZippedCsvDownload
        ).not_to receive(:create)
        flow_download_pivot.zipped_csv
      end
    end
  end

  describe :zipped_json do
    context 'when no precomputed file' do
      before(:each) do
        allow_any_instance_of(
          Api::V3::Download::PrecomputedDownload
        ).to receive(:retrieve).and_return(nil)
      end

      it 'creates a file for flat json' do
        expect_any_instance_of(
          Api::V3::Download::ZippedJsonDownload
        ).to receive(:create)
        flow_download_flat.zipped_json
      end

      it 'creates a file for pivot json' do
        expect_any_instance_of(
          Api::V3::Download::ZippedJsonDownload
        ).to receive(:create)
        flow_download_pivot.zipped_json
      end
    end

    context 'when precomputed file' do
      before(:each) do
        allow_any_instance_of(
          Api::V3::Download::PrecomputedDownload
        ).to receive(:retrieve).and_return('')
      end

      it 'does not create a file for flat csv' do
        expect_any_instance_of(
          Api::V3::Download::ZippedJsonDownload
        ).not_to receive(:create)
        flow_download_flat.zipped_json
      end

      it 'does not create a file for pivot csv' do
        expect_any_instance_of(
          Api::V3::Download::ZippedJsonDownload
        ).not_to receive(:create)
        flow_download_pivot.zipped_json
      end
    end
  end
end
