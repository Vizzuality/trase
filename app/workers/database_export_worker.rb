class DatabaseExportWorker
  include Sidekiq::Worker

  sidekiq_options queue: :low,
                  retry: false,
                  backtrace: true,
                  unique: :until_executed,
                  run_lock_expiration: 120, # 2 mins
                  log_duplicate_payload: true

  def perform
    Api::V3::DatabaseExport::Exporter.new.call
  end
end
