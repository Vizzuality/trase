class PrecomputedDownloadRefreshWorker
  include Sidekiq::Worker
  sidekiq_options queue: :database,
                  retry: false,
                  backtrace: true,
                  unique: :until_and_while_executing,
                  run_lock_expiration: 150, # 2.5 mins
                  log_duplicate_payload: true

  # @param context_id [Integer]
  def perform(context_id)
    context = Api::V3::Context.find(context_id)
    Api::V3::Download::PrecomputedDownload.new(context).call
  end
end
