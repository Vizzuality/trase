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
          forested_land_area: 'AG.LND.FRST.K2'
        }.freeze

        def self.population_indicators(iso_code = 'ALL')
          indicator_request(:population, iso_code)
        end

        def self.gdp_indicators(iso_code = 'ALL')
          indicator_request(:gdp, iso_code)
        end

        def self.land_area_indicators(iso_code = 'ALL')
          indicator_request(:land_area, iso_code)
        end

        def self.agricultural_land_area_indicators(iso_code = 'ALL')
          indicator_request(:agricultural_land_area, iso_code)
        end

        def self.forested_land_area_indicators(iso_code = 'ALL')
          indicator_request(:forested_land_area, iso_code)
        end

        private_class_method def self.indicator_request(name, iso_code)
          uri = URI(
            "#{ENV['WORLD_BANK_API_URL']}/v2/country/#{iso_code}/indicator/" \
            "#{INDICATORS[name]}?format=json&per_page=10000"
          )
          response = Net::HTTP.get_response(uri)

          return [] if response.code != '200'

          formatted_indicators(name, JSON.parse(response.body))
        end

        private_class_method def self.formatted_indicators(name, indicators_response)
          indicators = indicators_response.last.map do |indicator|
            {
              iso_code: indicator['countryiso3code'],
              name: name.to_s,
              year: indicator['date'].to_i,
              value: indicator['value'] || 0.0
            }
          end

          {
            last_updated: indicators_response.first['lastupdated'].to_date,
            indicators: indicators
          }
        end
      end
    end
  end
end
