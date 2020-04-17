class ComTradeRefreshWorker
  include Sidekiq::Worker
  sidekiq_options queue: :database,
                  retry: false,
                  backtrace: true

  def perform
    Api::V3::CountriesComTradeIndicators::ImporterService.new.call
  end
end
