require "rails_helper"

RSpec.describe MirrorDatabaseUpdateWorker, type: :worker do
  Sidekiq::Testing.inline!

  it_behaves_like "a database update worker" do
    before do
      allow_any_instance_of(
        Api::V3::DatabaseImport::SchemaImporter
      ).to receive(:call).and_return(nil)
    end
    let(:subject) {
      MirrorDatabaseUpdateWorker.perform_async(database_update.id, "MAIN/test.dump.gz")
    }
  end
end
