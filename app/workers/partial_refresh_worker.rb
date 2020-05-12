# To refresh materialized views or tables partially
class PartialRefreshWorker
  include Sidekiq::Worker
  sidekiq_options queue: :database,
                  retry: false,
                  backtrace: true

  # @param dependent_class_name [String] e.g. Api::V3::Readonly::DownloadAttribute
  # @param old_conditions [Hash]
  # @param new_conditions [Hash]
  # @param options
  # @option options [Boolean] :skip_dependents skip refreshing
  def perform(dependent_class_name, old_conditions = nil, new_conditions = nil, options = {})
    dependent_class = dependent_class_name.constantize
    dependent_class.refresh_by_conditions(
      old_conditions&.symbolize_keys,
      new_conditions&.symbolize_keys,
      options.symbolize_keys
    )
  end
end
