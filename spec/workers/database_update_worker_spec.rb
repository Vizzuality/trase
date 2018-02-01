require 'rails_helper'
require 'sidekiq/testing'

RSpec.describe DatabaseUpdateWorker, type: :worker do
  Sidekiq::Testing.inline!

  before do
    Api::V3::DatabaseUpdate.delete_all
  end

  context "When processing a successful database import" do
    before do
      allow_any_instance_of(
        Api::V3::Import::Importer
      ).to receive(:call).and_return({})
    end

    it "updates database_updates status to FINISHED" do
      # database_update = Api::V3::DatabaseUpdate.create(
      #   status: Api::V3::DatabaseUpdate::STARTED
      # )
      database_update = FactoryBot.create(:api_v3_database_update)
      DatabaseUpdateWorker.perform_async(database_update.id)
      expect(database_update.reload.status).to eq(Api::V3::DatabaseUpdate::FINISHED)
    end
  end

  context "When processing a failed database import" do
    before do
      allow_any_instance_of(
        Api::V3::Import::Importer
      ).to receive(:call).and_raise(StandardError)
    end

    it "updates database_updates status to FAILED" do
      # database_update = Api::V3::DatabaseUpdate.create(
      #   status: Api::V3::DatabaseUpdate::STARTED
      # )
      database_update = FactoryBot.create(:api_v3_database_update)
      DatabaseUpdateWorker.perform_async(database_update.id)
      expect(database_update.reload.status).to eq(Api::V3::DatabaseUpdate::FAILED)
    end
  end
end
