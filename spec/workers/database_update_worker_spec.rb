require 'rails_helper'
require 'sidekiq/testing'

RSpec.describe DatabaseUpdateWorker, type: :worker do
  Sidekiq::Testing.inline!

  before do
    Api::V3::DatabaseUpdate.delete_all
  end

  let(:database_update) {
    FactoryBot.create(:api_v3_database_update)
  }

  context "When processing a successful database import" do
    before do
      allow_any_instance_of(
        Api::V3::Import::Importer
      ).to receive(:backup).and_return(nil)
      allow_any_instance_of(
        Api::V3::Import::Importer
      ).to receive(:import).and_return({})
    end

    it "updates database_updates status to FINISHED" do
      database_update = FactoryBot.create(:api_v3_database_update)
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
