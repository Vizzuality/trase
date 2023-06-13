require "faraday/retry"

module Api
  module V3
    module CountriesWbIndicators
      class ApiConnection < Faraday::Connection
        include Singleton

        API_HOST = "https://api.worldbank.org".freeze

        def initialize
          retry_options = {
            max: 5,
            interval: 5,
            interval_randomness: 0.1, # the max rand interval as a float between 0 and 1 to add
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
