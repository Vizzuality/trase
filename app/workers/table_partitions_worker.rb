class TablePartitionsWorker
  include Sidekiq::Worker
  sidekiq_options queue: :database,
                  retry: 0,
                  backtrace: true,
                  unique: :until_and_while_executing,
                  run_lock_expiration: 150, # 2.5 mins
                  log_duplicate_payload: true

  def perform
    Api::V3::TablePartitions.create
  end
end
