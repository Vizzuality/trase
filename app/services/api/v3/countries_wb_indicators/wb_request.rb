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
          last_updated = indicators_response[:last_updated]
          return unless need_refreshing?(@indicator_name, last_updated)

          indicators = indicators_response[:indicators]
          indicators =
            add_rank_to_indicators(indicators, (@start_year..@end_year))
          indicators =
            indicators_by_countries(indicators, trase_countries_iso2)

          create_or_update_indicators(indicators)
        end

        private

        def api_indicators(indicator_name, start_year, end_year)
          Api::V3::CountriesWbIndicators::ApiService.indicator_request(
            indicator_name, 'ALL', start_year, end_year
          )
        end

        def need_refreshing?(indicator_name, timestamp)
          api_update = Api::V3::ExternalApiUpdate.find_or_initialize_by(
            name: 'WB', resource_name: indicator_name
          )
          if !api_update.persisted? ||
              api_update.last_update < timestamp.to_datetime
            api_update.last_update = timestamp.to_datetime
            api_update.save

            return true
          end

          false
        end

        def add_rank_to_indicators(indicators, years)
          years.each do |year|
            indicators_to_rank = indicators.
              select { |indicator| indicator[:year] == year }.
              sort_by { |indicator| indicator[:value] }.
              reverse
            indicators_to_rank.each_with_index.map do |indicator, index|
              indicator[:rank] = index + 1
              indicator
            end
          end
          indicators
        end

        def indicators_by_countries(indicators, trase_countries_iso2)
          indicators.select do |indicator|
            country = country_codes.lookup_by_iso3(indicator[:iso_code])
            iso2 = country && country[:iso2]
            iso2 && trase_countries_iso2.include?(iso2)
          end
        end

        def trase_countries_iso2
          node_type = Api::V3::NodeType.select(:id).
            where(name: NodeTypeName::COUNTRY)
          country_nodes_iso2 = Api::V3::Node.
            select(:geo_id).distinct.
            where(node_type_id: node_type).
            map(&:geo_id).compact
          countries_iso2 = Api::V3::Country.all.map(&:iso2)
          country_nodes_iso2 | countries_iso2
        end

        def create_or_update_indicators(indicators)
          indicators.each do |indicator|
            iso3 = indicator[:iso_code]
            country = country_codes.lookup_by_iso3(iso3)
            existing_indicator =
              Api::V3::CountriesWbIndicator.find_or_initialize_by(
                iso3: iso3,
                iso2: country[:iso2],
                name: indicator[:name],
                year: indicator[:year]
              )
            existing_indicator.value = indicator[:value]
            existing_indicator.rank = indicator[:rank]
            existing_indicator.save!
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
