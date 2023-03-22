class ComTradeRefreshWorker
  include Sidekiq::Worker

  class JobsInProgressError < StandardError; end

  sidekiq_options queue: :low,
                  retry: 30,
                  backtrace: true

  # The current retry count and exception is yielded. The return value of the
  # block must be an integer. It is used as the delay, in seconds. A return value
  # of nil will use the default.
  sidekiq_retry_in do |_count, exception|
    case exception
    when JobsInProgressError
      3600
    end
  end

  def perform(start_time, model_class_name, aggregated_model_class, error_class)
    model_class = model_class_name.constantize # e.g. Api::V3::CountriesComTradeWorldIndicator
    update_name = model_class.to_s.demodulize # e.g. CountriesComTradeWorldIndicator
    worker_class_name = update_name.sub(/^CountriesComTrade/, "ComTrade").sub(/Indicator/, "RequestWorker") # e.g. ComTradeWorldRequestWorker

    if Api::V3::JobsInProgress.instance.call(worker_class_name)
      raise JobsInProgressError.new worker_class_name
    end

    old_records = model_class.where("updated_at < ?", start_time)
    new_records = model_class.where("updated_at >= ?", start_time)
    number_of_old_records = old_records.count
    number_of_new_records = new_records.count

    # assuming a similar or greater number of rows since last refresh
    # otherwise something didn't go right or maybe update process is not
    # finished and refreshing should be retried later
    last_update = Api::V3::ExternalApiUpdate.
      where(name: update_name).
      order("last_update DESC").first&.last_update

    if number_of_new_records < (0.9 * number_of_old_records) &&
      last_update && last_update < start_time
      message = [
        "UN ComTrade #{update_name} too few records after update #{start_time}",
        "before: #{number_of_old_records}",
        "after: #{number_of_new_records}"
      ].join(", ")
      Rails.logger.error(message)
      raise error_class.new(message)
    end

    begin
      old_records.delete_all
      aggregated_model_class.constantize.refresh
      Api::V3::ExternalApiUpdate.create(
        name: "ComTrade", last_update: Time.now
      )
    rescue => e
      raise # re-raise same error
    end
  end
end
