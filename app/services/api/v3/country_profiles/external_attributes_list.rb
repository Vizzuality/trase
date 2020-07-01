module Api
  module V3
    module CountryProfiles
      class ExternalAttributesList
        include Singleton

        # @param attribute_ref [String]
        # e.g. wb.population.rank, com_trade.quantity.value
        # @param substitutions [Hash]
        # @param substitutions [String] :from
        # @param substitutions [String] :to
        def call(attribute_ref, substitutions = {})
          attribute_ref_parts = attribute_ref.split('.').map(&:to_sym)
          source = attribute_ref_parts.shift
          list =
            if source == :wb
              wb_attributes
            else
              com_trade_attributes
            end
          short_name = attribute_ref_parts.shift
          attribute_def = list[short_name]
          if substitutions.any?
            substitutions.each do |from, to|
              re = /%{#{from}}/
              attribute_def = attribute_def.merge({
                name: attribute_def[:name].gsub(re, to),
                tooltip: attribute_def[:tooltip].gsub(re, to)
              })
            end
          end
          attribute_def
        end

        def com_trade_attributes
          Api::V3::CountriesComTradeIndicators::IndicatorsList::ATTRIBUTES
        end

        def wb_attributes
          Api::V3::CountriesWbIndicators::IndicatorsList::ATTRIBUTES
        end
      end
    end
  end
end
