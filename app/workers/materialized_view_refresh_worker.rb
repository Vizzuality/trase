class MaterializedViewRefreshWorker
  include Sidekiq::Worker
  sidekiq_options queue: :database,
                  retry: 0,
                  backtrace: true,
                  unique: :until_and_while_executing,
                  run_lock_expiration: 150, # 2.5 mins
                  log_duplicate_payload: true

  # @param mview_class_name [String] e.g. Api::V3::Readonly::DownloadFlow
  def perform(mview_class_name, options)
    mview_class = mview_class_name.constantize
    mview_class.refresh(options)
  end
end
