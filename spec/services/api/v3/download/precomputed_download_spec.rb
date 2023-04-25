require "rails_helper"

RSpec.describe Api::V3::Download::PrecomputedDownload do
  include_context "api v3 brazil two flows"

  before(:each) do
    stub_const(
      "Api::V3::Download::PrecomputedDownload::ROOT_DIRNAME",
      "spec/support/downloads"
    )
  end

  before(:each) do
    Api::V3::Readonly::Attribute.refresh(skip_dependencies: true, skip_dependents: true)
    Api::V3::TablePartitions::CreatePartitionsForDenormalisedFlowQuants.new.call
    Api::V3::TablePartitions::CreatePartitionsForDenormalisedFlowQuals.new.call
    Api::V3::Readonly::DownloadFlowsStats.refresh(skip_dependencies: true, skip_dependents: true)
  end

  describe :call do
    it "stores a precomputed zip download" do
      Api::V3::Download::PrecomputedDownload.new(api_v3_brazil_soy_context).call
      output_file_name = [
        Api::V3::Download::PrecomputedDownload::ROOT_DIRNAME,
        "csv",
        "BRAZIL_SOY_pc.zip"
      ].join("/")
      expect(File).to exist(output_file_name)
    end
  end

  describe :refresh do
    it "stores precomputed zip downloads" do
      Api::V3::Download::PrecomputedDownload.refresh
      output_file_name = [
        Api::V3::Download::PrecomputedDownload::ROOT_DIRNAME,
        "csv",
        "BRAZIL_SOY_pc.zip"
      ].join("/")
      expect(File).to exist(output_file_name)
    end
  end

  describe :refresh_later do
    it "queues zip downloads to precompute" do
      Sidekiq::Testing.fake! do
        expect {
          Api::V3::Download::PrecomputedDownload.refresh_later
        }.to change(
          PrecomputedDownloadRefreshWorker.jobs, :size
        ).by(Api::V3::Context.count)
      end
    end
  end

  describe :clear do
    it "calls cache cleaner" do
      expect(
        Cache::Cleaner
      ).to receive(:clear_cache_for_regexp).twice
      Api::V3::Download::PrecomputedDownload.clear
    end
  end
end
