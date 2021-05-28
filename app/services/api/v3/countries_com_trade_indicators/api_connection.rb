module Api
  module V3
    module CountriesComTradeIndicators
      class ApiConnection < Faraday::Connection
        include Singleton

        API_HOST = 'https://comtrade.un.org'.freeze

        def initialize
          retry_options = {
            max: 5,
            interval: 10,
            interval_randomness: 0.5, # add to next retry interval
            backoff_factor: 2, # multiply next retry interval by this
            # retry_block: -> (env, options, retries, exc) { Rails.logger.debug "FARADAY RETRY (#{retries} left) FOR: #{exc}" },
            exceptions: [
              Errno::ETIMEDOUT,
              Timeout::Error,
              Faraday::TimeoutError,
              Faraday::ConnectionFailed,
              Faraday::ConflictError
            ]
          }
          super(API_HOST) do |conn|
            conn.request :retry, retry_options
            conn.response :raise_error
          end
          options.timeout = 120
          options.open_timeout = 120
        end
      end
    end
  end
end
