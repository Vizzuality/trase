module Api
  module V3
    module CountriesComTradeIndicators
      class ImporterService

        API_URL = 'https://comtrade.un.org/api/get'.freeze
        FIXED_PARAMS = {
          type: 'C', # Commodities (merchandise trade data)
          freq: 'A', # Annual
          px: 'HS', # HS Harmonized System (HS), as reported
          ps: 'all', # years (max 5)
          rg: 'all', # trade regime (imports / exports)
          r: 'all', # reporter
          p: 0, # partner area World
          fmt: 'json'
        }

        COMMODITY_CODES_PARAM = 'cc'.freeze # max 20
        YEAR_PARAM = 'ps'.freeze
        MAX_PARAM = 'max'.freeze

        # /api/get?max=500&type=C&freq=A&px=HS&ps=all&r=76&p=0&rg=all&cc=120810%2C230400%2C150710%2C150790%2C230250%2C120100%2C120110%2C120190
        def initialize
          @request_queue = []

          trase_commodity_ids.each do |commodity_id|
            commodities = commodity_codes.lookup_by_trase_id(commodity_id)
            next unless commodities

            codes = commodities.map do |commodity|
              commodity[:com_trade_codes]
            end.flatten

            years(commodity_id).each do |year|
              codes.each_slice(20) do |codes_slice|
                @request_queue << self.class.request_uri(codes_slice, year)
              end
            end
          end
        end

        # Usage limit (guest): 100 requests per hour (per IP address)
        MAX_REQUESTS_PER_HOUR = 100
        # Rate limit (guest): 1 request every second
        REQUEST_INTERVAL = 2 # let's make it double as timing inprecise
        BATCH_REQUEST_INTERVAL = 40 # number of seconds between requests

        def call
          request_no = @request_queue.length
          Rails.logger.debug("Scheduling #{request_no} UN ComTrade requests")

          interval =
            if request_no > MAX_REQUESTS_PER_HOUR
              BATCH_REQUEST_INTERVAL
            else
              REQUEST_INTERVAL
            end

          start_time = Time.now
          @request_queue.each.with_index do |uri, idx|
            Rails.logger.debug("Scheduling #{uri} ComTrade request")
            ComTradeRequestWorker.perform_in(interval * idx, uri)
          end
          ComTradeRefreshWorker.perform_in(
            REQUEST_INTERVAL * request_no + 1.hour,
            start_time
          )
        end

        # @param commodity_codes [Array<String>]
        # @param year [Integer]
        def self.request_uri(commodity_codes, year)
          # max: ~ 300 countries x 2 (exports / imports) x number of codes
          max = 600 * commodity_codes.length
          request_params = FIXED_PARAMS.merge({
            COMMODITY_CODES_PARAM => commodity_codes.join(','),
            YEAR_PARAM => year,
            MAX_PARAM => max
          })
          URI(API_URL + '?' + request_params.to_query)
        end

        private

        def trase_commodity_ids
          return @trase_commodity_ids if defined? @trase_commodity_ids

          @trase_commodity_ids = Api::V3::Commodity.all.pluck(:id)
        end

        def years(commodity_id)
          context_ids = Api::V3::Context.select(:id).
            where(commodity_id: commodity_id)
          years = Api::V3::Flow.
            select(:year).
            where(context_id: context_ids).
            distinct.
            pluck(:year)
        end

        def commodity_codes
          return @commodity_codes if defined? @commodity_codes

          @commodity_codes =
            Api::V3::CountriesComTradeIndicators::CommodityCodes.new
        end
      end
    end
  end
end
