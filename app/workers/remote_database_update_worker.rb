class RemoteDatabaseUpdateWorker
  include Sidekiq::Worker
  sidekiq_options queue: :database,
                  retry: false,
                  backtrace: true,
                  unique: :until_executed,
                  run_lock_expiration: 60 * 60 * 2, # 2 hrs
                  log_duplicate_payload: true

  def perform(database_update_id)
    database_update = Api::V3::DatabaseUpdate.find(database_update_id)
    database_update.update_attributes(jid: jid) # make sure validations run here
    Api::V3::Import::RemoteImport.new.call(database_update)
  end
end
