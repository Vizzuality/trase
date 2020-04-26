require 'net/http'

module Api
  module V3
    module CountriesWbIndicators
      class ApiService
        WORLD_BANK_API_URL = 'https://api.worldbank.org'.freeze

        def self.indicator_request(wb_name, iso3, start_year = nil, end_year = nil)
          response = Net::HTTP.get_response(
            request_uri(wb_name, iso3, [start_year,end_year].compact.join(':').presence)
          )

          return [] if response.code != '200'

          formatted_indicators(wb_name, JSON.parse(response.body))
        end

        # @param wb_name [String]
        # @param iso3 [String]
        # @param @start_year [Integer]
        # @param @end_year [Integer]
        def self.request_uri(wb_name, iso3, start_year = nil, end_year = nil)
          query_params = {format: :json, per_page: 10000}
          if start_year
            query_params[:date] = [start_year, end_year].compact.join(':')
          end
          uri = URI(
            "#{WORLD_BANK_API_URL}/v2/country/#{iso3}/indicator/" \
            "#{wb_name}?" + query_params.to_query
          )
        end

        private_class_method def self.formatted_indicators(wb_name, indicators_response)
          indicators = indicators_response.last.map do |indicator|
            next if indicator['value'].blank?

            {
              iso_code: indicator['countryiso3code'],
              name: wb_name,
              year: indicator['date'].to_i,
              value: indicator['value']
            }
          end

          {
            last_updated: indicators_response.first['lastupdated'].to_date,
            indicators: indicators.compact
          }
        end
      end
    end
  end
end
