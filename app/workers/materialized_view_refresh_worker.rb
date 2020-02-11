class MaterializedViewRefreshWorker
  include Sidekiq::Worker
  sidekiq_options queue: :database,
                  retry: false,
                  backtrace: true,
                  unique: :until_and_while_executing,
                  run_lock_expiration: 150, # 2.5 mins
                  log_duplicate_payload: true

  def self.unique_args(args)
    [args[0]]
  end

  # @param mview_class_name [String] e.g. Api::V3::Readonly::DownloadAttribute
  # @param options
  # @option options [Boolean] :skip_dependencies skip refreshing
  # @option options [Boolean] :skip_dependents skip refreshing
  def perform(mview_class_name, options)
    mview_class = mview_class_name.constantize
    mview_class.refresh_now(options.symbolize_keys)
  end
end
