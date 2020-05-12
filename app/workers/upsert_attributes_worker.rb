class UpsertAttributesWorker
  include Sidekiq::Worker
  sidekiq_options queue: :database,
                  retry: false,
                  backtrace: true,
                  unique: :until_and_while_executing,
                  log_duplicate_payload: true

  # @param options
  # @option options [Boolean] :skip_dependents skip refreshing
  def perform(options)
    Api::V3::Readonly::Attribute.refresh_now(options.symbolize_keys)
  end
end
