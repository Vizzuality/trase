require "rails_helper"

RSpec.describe PrecomputedDownloadRefreshWorker, type: :worker do
  Sidekiq::Testing.inline!

  before(:each) do
    stub_const(
      "Api::V3::Download::PrecomputedDownload::ROOT_DIRNAME",
      "spec/support/downloads"
    )
  end

  describe :call do
    before(:each) do
      Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
    end

    let(:context) { FactoryBot.create(:api_v3_context) }
    it "symbolizes options keys" do
      expect(Api::V3::Download::FlowDownload).to receive(:new).
        with(context, pivot: true).and_call_original
      PrecomputedDownloadRefreshWorker.perform_async(context.id)
    end
  end
end
