class ComTradeWorldRequestWorker
  include Sidekiq::Worker

  sidekiq_options queue: :high,
                  retry: 5,
                  backtrace: true

  def perform(uri)
    Rails.logger.debug("UN ComTrade #{uri}")
    Api::V3::CountriesComTradeIndicators::WorldRequest.new(uri).call
  end
end
