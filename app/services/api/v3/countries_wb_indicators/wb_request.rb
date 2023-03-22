module Api
  module V3
    module CountriesWbIndicators
      class WbRequest
        class WbError < StandardError; end

        def initialize(indicator_name, start_year, end_year)
          @indicator_name = indicator_name
          @start_year = start_year
          @end_year = end_year
        end

        def call
          indicators_response = api_indicators(
            @indicator_name, @start_year, @end_year
          )
          return unless indicators_response

          last_updated = indicators_response[:last_updated]
          return unless need_refreshing?(@indicator_name, last_updated)

          refresh_indicators(indicators_response[:indicators])
        end

        private

        def api_indicators(indicator_name, start_year, end_year)
          Api::V3::CountriesWbIndicators::ApiService.indicator_request(
            indicator_name, "ALL", start_year, end_year
          )
        end

        def need_refreshing?(indicator_name, timestamp)
          api_update = Api::V3::ExternalApiUpdate.find_or_initialize_by(
            name: "WB", resource_name: indicator_name
          )
          if !api_update.persisted? ||
              api_update.last_update < timestamp.to_datetime
            api_update.last_update = timestamp.to_datetime
            api_update.save

            return true
          end

          false
        end

        def refresh_indicators(indicators)
          (@start_year..@end_year).each do |year|
            indicators_to_update = indicators.select { |indicator| indicator[:year] == year }
            indicators_to_update = filter_countries(indicators_to_update)
            indicators_to_update = calculate_ranks(indicators_to_update)
            Api::V3::CountriesWbIndicator.where(name: @indicator_name, year: year).delete_all
            indicators_to_update.each do |indicator|
              iso3 = indicator[:iso_code]
              country = country_codes.lookup_by_iso3(iso3)
              Api::V3::CountriesWbIndicator.create(
                iso3: iso3,
                iso2: country[:iso2],
                name: indicator[:name],
                year: indicator[:year],
                value: indicator[:value],
                rank: indicator[:rank]
              )
            end
          end
        end

        # reject values for regions and groupings
        def filter_countries(indicators)
          indicators.reject { |indicator| country_codes.lookup_by_iso3(indicator[:iso_code]).nil? }
        end

        # rank by value
        def calculate_ranks(indicators)
          sorted = indicators.
            sort_by { |indicator| indicator[:value] }.
            reverse
          sorted.each_with_index.map do |indicator, index|
            indicator[:rank] = index + 1
            indicator
          end
        end

        def country_codes
          return @country_codes if defined? @country_codes

          @country_codes =
            Api::V3::CountriesComTradeIndicators::CountryCodes.new
        end
      end
    end
  end
end
