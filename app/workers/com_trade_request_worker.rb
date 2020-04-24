class ComTradeRequestWorker
  include Sidekiq::Worker
  sidekiq_options queue: :external_apis,
                  backtrace: true

  def perform(uri)
    Rails.logger.debug("UN ComTrade #{uri}")
    Api::V3::CountriesComTradeIndicators::ComTradeRequest.new(uri).call
  end
end
