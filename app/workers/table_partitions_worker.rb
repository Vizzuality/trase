class TablePartitionsWorker
  include Sidekiq::Worker
  sidekiq_options queue: :database,
                  retry: 0,
                  backtrace: true,
                  unique: :until_and_while_executing,
                  run_lock_expiration: 150, # 2.5 mins
                  log_duplicate_payload: true

  # @param options
  # @option options [Boolean] :skip_dependencies skip refreshing
  # @option options [Boolean] :skip_dependents skip refreshing
  # @option options [Boolean] :skip_precompute skip precomputing downloads
  def perform(options)
    Api::V3::Readonly::DownloadFlow.refresh_now(options.symbolize_keys)
  end
end
