class DatabaseImportWorker
  include Sidekiq::Worker

  sidekiq_options queue: :database,
                  retry: false,
                  backtrace: true,
                  unique: :until_executed,
                  run_lock_expiration: 120, # 2 mins
                  log_duplicate_payload: true

  def perform(s3_filename)
    Api::V3::DatabaseImport::Importer.new(s3_filename).call
  end
end
