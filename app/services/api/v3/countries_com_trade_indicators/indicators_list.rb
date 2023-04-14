module Api
  module V3
    module CountriesComTradeIndicators
      module IndicatorsList
        ATTRIBUTES = {
          value: {
            short_name: :value,
            name: "Value of agricultural %{trade_flow}s",
            unit: "$",
            unit_position: "prefix",
            tooltip: "Value of agricultural %{trade_flow}s ($)"
          },
          quantity: {
            short_name: :quantity,
            name: "Netweight",
            unit: "kg",
            unit_position: "suffix",
            tooltip: "Netweight (kg)"
          }
        }.freeze
      end
    end
  end
end
