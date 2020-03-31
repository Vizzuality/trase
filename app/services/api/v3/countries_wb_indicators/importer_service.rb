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
            indicators = api_indicators(indicator_name)
            indicators = add_rank_to_indicators(indicators)
            indicators = indicators_by_countries(indicators, countries_iso)

            create_or_update_indicators(indicators)
          end
        end

        private_class_method def self.api_indicators(indicator_name)
          Api::V3::CountriesWbIndicators::ApiService.
            send("#{indicator_name}_indicators")
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
            existing_indicator.save
          end
        end
      end
    end
  end
end
