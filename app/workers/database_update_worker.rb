class DatabaseUpdateWorker
  include Sidekiq::Worker
  sidekiq_options retry: false

  def perform(database_update_id)
    database_update = Api::V3::DatabaseUpdate.find(database_update_id)
    database_update.update_attribute(:jid, self.jid)
    Api::V3::Import::Importer.new.call(database_update)
    database_update.update_attribute(:status, Api::V3::DatabaseUpdate::FINISHED)
  end
end
