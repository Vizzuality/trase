require 'net/http'

module Api
  module V3
    module CountriesWbIndicators
      class ApiService
        INDICATORS = {
          population: 'SP.POP.TOTL',
          gdp: 'NY.GDP.MKTP.CD',
          land_area: 'ag.lnd.totl.k2',
          agricultural_land_area: 'AG.LND.AGRI.K2',
          forested_land_area: 'AG.LND.FRST.K2',
          human_development_index: 'UNDP.HDI.XD'
        }.freeze

        def self.population_indicators(iso3, start_year = nil, end_year = nil)
          indicator_request(:population, iso3, start_year, end_year)
        end

        def self.gdp_indicators(iso3, start_year = nil, end_year = nil)
          indicator_request(:gdp, iso3, start_year, end_year)
        end

        def self.land_area_indicators(iso3, start_year = nil, end_year = nil)
          indicator_request(:land_area, iso3, start_year, end_year)
        end

        def self.agricultural_land_area_indicators(iso3, start_year = nil, end_year = nil)
          indicator_request(:agricultural_land_area, iso3, start_year, end_year)
        end

        def self.forested_land_area_indicators(iso3, start_year = nil, end_year = nil)
          indicator_request(:forested_land_area, iso3, start_year, end_year)
        end

        def self.human_development_index_indicators(iso3, start_year = nil, end_year = nil)
          indicator_request(:human_development_index, iso3, start_year, end_year)
        end

        private_class_method def self.indicator_request(name, iso3, start_year = nil, end_year = nil)
          query_params = {format: :json, per_page: 10000}
          if start_year
            query_params[:date] = [start_year, end_year].join(':')
          end
          uri = URI(
            "#{ENV['WORLD_BANK_API_URL']}/v2/country/#{iso3}/indicator/" \
            "#{INDICATORS[name]}?" + query_params.to_query
          )
          response = Net::HTTP.get_response(uri )

          return [] if response.code != '200'

          formatted_indicators(name, JSON.parse(response.body))
        end

        private_class_method def self.formatted_indicators(name, indicators_response)
          indicators = indicators_response.last.map do |indicator|
            next if indicator['value'].blank?

            {
              iso_code: indicator['countryiso3code'],
              name: name.to_s,
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
