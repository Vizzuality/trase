require 'json'

module Api
  module V3
    module CountriesWbIndicators
      class ImporterService
        COUNTRY_ISO3 = {
          'ARG' => 'AR',
          'BOL' => 'BO',
          'BRA' => 'BR',
          'COL' => 'CO',
          'ECU' => 'EC',
          'IDN' => 'ID',
          'PRY' => 'PY',
          'PER' => 'PE'
        }.freeze

        def self.import(indicator_names = Api::V3::CountriesWbIndicators::ApiService::INDICATORS.keys)
          countries_iso = Api::V3::Country.all.map(&:iso2)
          indicator_names.each do |indicator_name|
            indicators_response = api_indicators(indicator_name)
            unless need_refreshing?(indicator_name, indicators_response[:last_updated])
              next
            end

            indicators =
              add_rank_to_indicators(indicators_response[:indicators])

            indicators = indicators_by_countries(indicators, countries_iso)

            create_or_update_indicators(indicators)
          end
        end

        private_class_method def self.api_indicators(indicator_name)
          Api::V3::CountriesWbIndicators::ApiService.
            send("#{indicator_name}_indicators")
        end

        private_class_method def self.need_refreshing?(indicator_name, timestamp)
          timestamps = if File.exist?('public/worldbank.json')
                         file = File.open('public/worldbank.json')
                         JSON.parse(file)
                       else
                         {}
                       end

          if timestamps[indicator_name].blank? ||
              timestamps[indicator_name].to_date < timestamp.to_date
            timestamps[indicator_name] = timestamp
            File.write('public/worldbank.json', timestamps.to_json)

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
