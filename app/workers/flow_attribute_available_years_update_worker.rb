class FlowAttributeAvailableYearsUpdateWorker
  include Sidekiq::Worker

  sidekiq_options queue: :critical,
                  retry: false,
                  backtrace: true

  def perform(object_class_name, object_id, context_id)
    object_class = object_class_name.constantize
    object = object_class.find(object_id)
    return unless object

    attribute = object.original_attribute
    return unless attribute

    years = attribute.
      flows.
      where(context_id: context_id).
      select(:year).
      distinct.
      map(&:year).
      sort
    object.update_attribute(:years, years)
  end
end
