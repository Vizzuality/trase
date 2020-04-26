module Api
  module V3
    module CountriesComTradeIndicators
      module IndicatorsList
        ATTRIBUTES = {
          value: {
            short_name: :value,
            name: 'Value of agricultural %{trade_flow}s',
            prefix: '$',
            tooltip: 'Value of agricultural %{trade_flow}s ($)'
          },
          quantity: {
            short_name: :quantity,
            name: 'Netweight',
            suffix: 'kg',
            tooltip: 'Netweight (kg)'
          }
        }.freeze
      end
    end
  end
end
