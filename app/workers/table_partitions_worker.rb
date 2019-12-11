class TablePartitionsWorker
  include Sidekiq::Worker
  sidekiq_options queue: :database,
                  retry: 0,
                  backtrace: true,
                  unique: :until_and_while_executing,
                  run_lock_expiration: 300, # 5 mins
                  log_duplicate_payload: true

  # @param ro_model_class_name [String] e.g. Api::V3::Readonly::DownloadFlow
  # @param options
  # @option options [Boolean] :skip_dependencies skip refreshing
  # @option options [Boolean] :skip_dependents skip refreshing
  # @option options [Boolean] :skip_precompute skip precomputing downloads
  def perform(ro_model_class_name, options)
    ro_model_class = ro_model_class_name.constantize
    ro_model_class.refresh_now(options.symbolize_keys)
  end
end
