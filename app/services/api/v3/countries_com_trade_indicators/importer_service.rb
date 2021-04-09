module Api
  module V3
    module CountriesComTradeIndicators
      class ImporterService
        # /api/get?max=500&type=C&freq=A&px=HS&ps=all&r=76&p=0&rg=all&cc=120810%2C230400%2C150710%2C150790%2C230250%2C120100%2C120110%2C120190
        def initialize
          @world_request_queue = WorldRequestUriQueue.new.call
          @partner_request_queue = PartnerRequestUriQueue.new.call
        end

        # Usage limit (guest): 100 requests per hour (per IP address)
        MAX_REQUESTS_PER_HOUR = 100
        # Rate limit (guest): 1 request every second
        REQUEST_INTERVAL = 2 # let's make it double as timing imprecise
        BATCH_REQUEST_INTERVAL = 40 # number of seconds between requests 3600 / 100

        def call
          # do not run in production
          return if Rails.env.production?
          # On staging, run in the first week of the month
          return if Rails.env.staging? && Date.today.day > 7
          # On sandbox, run in the second week of the month
          return if Rails.env.sandbox? && (Date.today.day > 14 || Date.today.day <= 7)
          # elsewhere run in the third week of the month
          return unless (Date.today.day > 14 && Date.today.day <= 21) || Rails.env.test? || Rails.env.development?

          world_request_no = @world_request_queue.length
          partner_request_no = @partner_request_queue.length
          total_request_no = world_request_no + partner_request_no

          interval =
            if total_request_no > MAX_REQUESTS_PER_HOUR
              BATCH_REQUEST_INTERVAL
            else
              REQUEST_INTERVAL
            end

          Rails.logger.debug("Scheduling #{total_request_no} UN ComTrade requests every #{interval} seconds")

          start_time = Time.now
          @world_request_queue.each.with_index do |uri, idx|
            Rails.logger.debug("Scheduling #{uri} ComTrade request (world)")
            ComTradeWorldRequestWorker.perform_in(interval * idx, uri)
          end
          offset = @world_request_queue.length * interval
          ComTradeRefreshWorker.perform_in(
            offset + 30.minutes,
            start_time,
            Api::V3::CountriesComTradeWorldIndicator,
            Api::V3::Readonly::CountriesComTradeWorldAggregatedIndicator,
            Api::V3::CountriesComTradeIndicators::WorldRequest::ComTradeError
          )

          start_time = Time.now + offset
          @partner_request_queue.each.with_index do |uri, idx|
            Rails.logger.debug("Scheduling #{uri} ComTrade request (partner)")
            ComTradePartnerRequestWorker.perform_in(offset + interval * idx, uri)
          end
          ComTradeRefreshWorker.perform_in(
            offset + interval * partner_request_no + 30.minutes,
            start_time,
            Api::V3::CountriesComTradePartnerIndicator,
            Api::V3::Readonly::CountriesComTradePartnerAggregatedIndicator,
            Api::V3::CountriesComTradeIndicators::PartnerRequest::ComTradeError
          )
        end
      end
    end
  end
end
