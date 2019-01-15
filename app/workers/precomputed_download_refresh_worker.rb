class PrecomputedDownloadRefreshWorker
  include Sidekiq::Worker
  sidekiq_options queue: :database,
                  retry: false,
                  backtrace: true,
                  unique: :until_and_while_executing,
                  log_duplicate_payload: true

  def self.unique_args(args)
    [args[0], args[1]]
  end

  # @param context_id [Integer]
  # @param options
  # @option options [Boolean] :skip_dependencies skip refreshing
  # @option options [Boolean] :skip_dependents skip refreshing
  def perform(context_id, options)
    context = Api::V3::Context.find(context_id)
    Api::V3::Download::FlowDownload.new(context, options.symbolize_keys).
      zipped_csv
  end
end
