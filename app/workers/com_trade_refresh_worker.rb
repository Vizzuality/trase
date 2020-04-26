class ComTradeRefreshWorker
  include Sidekiq::Worker
  sidekiq_options queue: :external_apis,
                  retry: 3,
                  backtrace: true

  def perform(start_time)
    old_records = Api::V3::CountriesComTradeIndicator.
      where('updated_at < ?', start_time)
    new_records = Api::V3::CountriesComTradeIndicator.
      where('updated_at >= ?', start_time)
    number_of_old_records = old_records.count
    number_of_new_records = new_records.count

    # assuming a similar or greater number of rows since last refresh
    # otherwise something didn't go right or maybe update process is not
    # finished and refreshing should be retried later
    last_update = Api::V3::ExternalApiUpdate.
      where(name: 'ComTrade').
      order('last_update DESC').first&.last_update

    if number_of_new_records < (0.9 * number_of_old_records) &&
      last_update && last_update < start_time
      message = [
        "UN ComTrade too few records after update #{start_time}",
        "before: #{number_of_old_records}",
        "after: #{number_of_new_records}"
      ].join(', ')
      Rails.error.log(message)
      raise Api::V3::CountriesComTradeIndicators::ComTradeError.new(message)
    end

    begin
      old_records.delete_all
      Api::V3::Readonly::CountriesComTradeAggregatedIndicator.refresh
      Api::V3::ExternalApiUpdate.create(
        name: 'ComTrade', last_update: Time.now
      )
    rescue => e
      raise # re-raise same error
    end
  end
end
