module Api
  module V3
    module CountryProfiles
      class ExternalAttributeValue
        AttributeValue = Struct.new(:value, :year)
        # @param iso_code2 [String]
        # @param year [Integer]
        # @param activity [Symbol] e.g. :exporter, :importer
        # @param commodity_id [Integer]
        def initialize(iso2, year, activity, commodity_id = nil)
          @commodity_id = commodity_id
          @iso2 = iso2
          @year = year
          @activity = activity
          @memo = {}
        end

        # @param attribute_ref [String]
        # e.g. wb.population.rank, com_trade.quantity.value
        def call(attribute_ref)
          return @memo[attribute_ref] if @memo.key?(attribute_ref)

          attribute_ref_parts = attribute_ref.split('.').map(&:to_sym)
          source = attribute_ref_parts.shift
          value =
            if source == :wb
              wb_value(*attribute_ref_parts)
            elsif source == :com_trade
              com_trade_value(*attribute_ref_parts)
            end
          @memo[attribute_ref] = value
          value
        end

        private

        # @param attribute_short_name [Symbol] e.g. :population
        # @param property [Symbol] e.g. :rank
        def wb_value(attribute_short_name, property)
          list = Api::V3::CountriesWbIndicators::IndicatorsList::ATTRIBUTES
          attribute = list[attribute_short_name]
          unless attribute && [:value, :rank].include?(property)
            return nil
          end

          row = Api::V3::CountriesWbIndicator.
            where(iso2: @iso2, name: attribute[:wb_name]).
            where('year <= ?', @year).
            order('year DESC').
            limit(1).
            first
          return nil unless row

          AttributeValue.new(row.send(property), row.send(:year))
        end

        # @param attribute_short_name [Symbol] e.g. :population
        # @param property [Symbol] e.g. :rank
        def com_trade_value(attribute_short_name, property)
          list = Api::V3::CountriesComTradeIndicators::IndicatorsList::ATTRIBUTES
          attribute = list[attribute_short_name]
          unless attribute && [:value, :rank].include?(property)
            return nil
          end

          row = Api::V3::Readonly::CountriesComTradeWorldAggregatedIndicator.find_by(
            commodity_id: @commodity_id,
            iso2: @iso2,
            year: @year,
            activity: @activity
          )
          return nil unless row

          value =
            if property == :rank
              row.send(:"#{attribute_short_name}_rank")
            else
              row.send(attribute_short_name)
            end
          AttributeValue.new(value, row.send(:year))
        end
      end
    end
  end
end
