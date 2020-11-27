class ComTradeRefreshWorker
  include Sidekiq::Worker

  sidekiq_options queue: :low,
                  retry: 3,
                  backtrace: true

  def perform(start_time, model_class, aggregated_model_class, error_class)
    old_records = model_class.constantize.where('updated_at < ?', start_time)
    new_records = model_class.constantize.where('updated_at >= ?', start_time)
    number_of_old_records = old_records.count
    number_of_new_records = new_records.count

    # assuming a similar or greater number of rows since last refresh
    # otherwise something didn't go right or maybe update process is not
    # finished and refreshing should be retried later
    update_name = model_class.to_s.demodulize
    last_update = Api::V3::ExternalApiUpdate.
      where(name: update_name).
      order('last_update DESC').first&.last_update

    if number_of_new_records < (0.9 * number_of_old_records) &&
      last_update && last_update < start_time
      message = [
        "UN ComTrade #{update_name} too few records after update #{start_time}",
        "before: #{number_of_old_records}",
        "after: #{number_of_new_records}"
      ].join(', ')
      Rails.logger.error(message)
      raise error_class.new(message)
    end

    begin
      old_records.delete_all
      aggregated_model_class.constantize.refresh
      Api::V3::ExternalApiUpdate.create(
        name: 'ComTrade', last_update: Time.now
      )
    rescue => e
      raise # re-raise same error
    end
  end
end
