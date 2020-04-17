module Api
  module V3
    module CountryProfiles
      class ExternalAttributeValue
        include Singleton

        # @param iso_code2 [String]
        # @param year [Integer]
        # @param activity [Symbol] (:exporter, :importer)
        # @param attribute_ref [Hash]
        # @option attribute_ref [Symbol] :source (:wb, :comtrade)
        # @option attribute_ref [String] :id
        # e.g. {source: :wb, id: 'WB SP.POP.TOTL'}
        def call(iso_code2, year, activity, attribute_ref)
          # TODO: implement
          if attribute_ref[:source] == :wb
            return Api::V3::CountriesWbIndicator.find_by(
              iso_code: iso_code2,
              year: year,
              name: attribute_ref[:id]
            )&.value
          end

          0
        end
      end
    end
  end
end
