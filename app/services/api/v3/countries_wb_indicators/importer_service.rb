require 'json'

module Api
  module V3
    module CountriesWbIndicators
      class ImporterService
        COUNTRY_ISO3 = Hash[
          ISO3166::Country.all_names_with_codes.map(&:last).collect do |alpha2|
            [ISO3166::Country.find_country_by_alpha2(alpha2).alpha3, alpha2]
          end
        ]

        def self.import(indicator_names = Api::V3::CountriesWbIndicators::ApiService::INDICATORS.keys)
          countries = countries_iso
          indicator_names.each do |indicator_name|
            indicators_response = api_indicators(indicator_name)
            last_updated = indicators_response[:last_updated]
            next unless need_refreshing?(indicator_name, last_updated)

            indicators =
              add_rank_to_indicators(indicators_response[:indicators])

            indicators = indicators_by_countries(indicators, countries)

            create_or_update_indicators(indicators)
          end
        end

        private_class_method def self.countries_iso
          node_type = Api::V3::NodeType.find_by(name: 'COUNTRY')
          nodes_country_iso2 = Api::V3::Node.
            select(:geo_id).distinct.
            where(node_type_id: node_type.id).
            map(&:geo_id).compact
          countries_iso2 = Api::V3::Country.all.map(&:iso2)
          nodes_country_iso2 | countries_iso2
        end

        private_class_method def self.api_indicators(indicator_name)
          Api::V3::CountriesWbIndicators::ApiService.
            send("#{indicator_name}_indicators")
        end

        private_class_method def self.need_refreshing?(indicator_name, timestamp)
          worldbank =
            Api::V3::Worldbank.find_or_initialize_by(name: indicator_name)
          if !worldbank.persisted? ||
              worldbank.last_update < timestamp.to_datetime
            worldbank.last_update = timestamp.to_datetime
            worldbank.save

            return true
          end

          false
        end

        private_class_method def self.add_rank_to_indicators(indicators)
          indicators.
            sort_by { |indicator| indicator[:value] }.
            reverse.
            each_with_index.map do |indicator, index|
              indicator[:rank] = index + 1
              indicator
            end
        end

        private_class_method def self.indicators_by_countries(indicators, countries_iso)
          indicators.select do |indicator|
            countries_iso.include? COUNTRY_ISO3[indicator[:iso_code]]
          end
        end

        private_class_method def self.create_or_update_indicators(indicators)
          indicators.each do |indicator|
            existing_indicator =
              Api::V3::CountriesWbIndicator.find_or_initialize_by(
                iso_code: indicator[:iso_code],
                name: indicator[:name],
                year: indicator[:year]
              )
            existing_indicator.value = indicator[:value]
            existing_indicator.rank = indicator[:rank]
            existing_indicator.save!
          end
        end
      end
    end
  end
end
