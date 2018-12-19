require 'rails_helper'

RSpec.describe DatabaseUpdateWorker, type: :worker do
  Sidekiq::Testing.inline!

  let(:database_update) {
    FactoryBot.create(:api_v3_database_update)
  }

  before do
    allow(
      Api::V3::Download::PrecomputedDownload
    ).to receive(:refresh)
  end

  context "When processing a successful database import" do
    before do
      allow_any_instance_of(
        Api::V3::Import::Importer
      ).to receive(:backup).and_return(nil)
      allow_any_instance_of(
        Api::V3::Import::Importer
      ).to receive(:import).and_return({})
      allow(Cache::Warmer::UrlsFile).to receive(:generate)
    end

    it "updates database_updates status to FINISHED" do
      DatabaseUpdateWorker.perform_async(database_update.id)
      expect(database_update.reload.status).to eq(Api::V3::DatabaseUpdate::FINISHED)
    end
  end

  context "When processing a failed database import" do
    before do
      allow_any_instance_of(
        Api::V3::Import::Importer
      ).to receive(:backup).and_return(nil)
      allow_any_instance_of(
        Api::V3::Import::Importer
      ).to receive(:import).and_raise(PG::Error)
    end

    it "raises exception" do
      expect {
        DatabaseUpdateWorker.perform_async(database_update.id)
      }.to raise_exception(PG::Error)
    end

    it "updates database_updates status to FAILED" do
      begin
        DatabaseUpdateWorker.perform_async(database_update.id)
      rescue
        expect(database_update.reload.status).to eq(Api::V3::DatabaseUpdate::FAILED)
      end
    end
  end
end
