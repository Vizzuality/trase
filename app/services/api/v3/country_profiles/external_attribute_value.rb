module Api
  module V3
    module CountryProfiles
      class ExternalAttributeValue
        include Singleton

        # @param commodity_id [Integer]
        # @param iso_code2 [String]
        # @param year [Integer]
        # @param activity [Symbol] (:exporter, :importer)
        # @param attribute_ref [Hash]
        # @option attribute_ref [Symbol] :source (:wb, :com_trade)
        # @option attribute_ref [String] :id
        # e.g. {source: :wb, id: 'WB SP.POP.TOTL'}
        def call(commodity_id, iso2, year, activity, attribute_ref)
          if attribute_ref[:source] == :wb
            return wb_value(iso2, year, attribute_ref[:id])
          end
          if attribute_ref[:source] == :com_trade
            return com_trade_value(commodity_id, iso2, year, activity, attribute_ref[:id])
          end
          nil
        end

        private

        def wb_value(iso2, year, attribute_name)
          row = Api::V3::CountriesWbIndicator.find_by(
            iso_code: ISO3166::Country.new(iso2).alpha3,
            year: year,
            name: Api::V3::CountriesWbIndicators::ApiService::INDICATORS.key(attribute_name)
          )
          return nil unless row

          {value: row&.value, rank: row&.rank}
        end

        def com_trade_value(commodity_id, iso2, year, activity, attribute_name)
          return nil unless [:value, :quantity].include? attribute_name

          row = Api::V3::Readonly::CountriesComTradeAggregatedIndicator.find_by(
            commodity_id: commodity_id,
            iso2: iso2,
            year: year,
            activity: activity
          )
          return nil unless row

          {
            value: row.send(attribute_name),
            rank: row.send(:"#{attribute_name}_rank")
          }
        end
      end
    end
  end
end
