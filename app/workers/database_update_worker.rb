class DatabaseUpdateWorker
  include Sidekiq::Worker
  sidekiq_options queue: :database,
                  retry: 0,
                  backtrace: true,
                  unique: :until_executed,
                  run_lock_expiration: 60 * 60 * 2, # 2 hrs
                  log_duplicate_payload: true

  def perform(database_update_id)
    database_update = Api::V3::DatabaseUpdate.find(database_update_id)
    database_update.update_attributes(jid: self.jid) # make sure validations run here
    ActiveRecord::Base.transaction do
      Api::V3::Import::Importer.new.call(database_update)
    end
    database_update.update_attribute(:status, Api::V3::DatabaseUpdate::FINISHED)
  rescue => e
    database_update.update_attribute(:status, Api::V3::DatabaseUpdate::FAILED)
    database_update.update_attribute(:error, e.message)
    Rails.logger.error e.message
    Appsignal.send_error(e)
    return
  end
end
