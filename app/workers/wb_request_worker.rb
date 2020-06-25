class WbRequestWorker
  include Sidekiq::Worker
  sidekiq_options queue: :external_apis,
                  retry: 3,
                  backtrace: true

  def perform(indicator_name, start_year, end_year)
    Rails.logger.debug("WorldBank #{indicator_name}")
    Api::V3::CountriesWbIndicators::WbRequest.new(
      indicator_name, start_year, end_year
    ).call
  end
end
