require 'rails_helper'

RSpec.describe RemoteDatabaseUpdateWorker, type: :worker do
  Sidekiq::Testing.inline!

  it_behaves_like 'a database update worker' do
    let(:subject) {
      RemoteDatabaseUpdateWorker.perform_async(database_update.id)
    }
  end
end
