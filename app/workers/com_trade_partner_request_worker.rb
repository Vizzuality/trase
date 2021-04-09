class ComTradePartnerRequestWorker
  include Sidekiq::Worker

  sidekiq_options queue: :default,
                  retry: 10,
                  backtrace: true

  def perform(uri)
    Rails.logger.debug("UN ComTrade #{uri} (partner)")
    Api::V3::CountriesComTradeIndicators::PartnerRequest.new(uri).call
  end
end
