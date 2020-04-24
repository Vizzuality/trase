module Api
  module V3
    module CountryProfiles
      class ExternalAttributesList
        include Singleton

        # @param attribute_refs [Array<Hash>]
        # e.g. [{source: :wb, id: 'WB SP.POP.TOTL'}]
        # @param substitutions [Hash]
        def call(attribute_refs, substitutions = {})
          list =
            attribute_refs.map do |ref|
              if ref[:source] == :wb
                WB_ATTRIBUTES[ref[:id]]
              else
                COMTRADE_ATTRIBUTES[ref[:id]]
              end
            end

          if substitutions.any?
            list = list.map do |attribute|
              substitutions.each do |from, to|
                re = /%{#{from}}/
                attribute = attribute.merge({
                  name: attribute[:name].gsub(re, to),
                  tooltip: attribute[:tooltip].gsub(re, to)
                })
              end
              attribute
            end
          end
          list
        end

        WB_ATTRIBUTES = {
          'SP.POP.TOTL' => {
            name: 'Population',
            suffix: 'people',
            tooltip: 'Population, total'
          },
          'NY.GDP.MKTP.CD' => {
            name: 'GDP',
            prefix: '$',
            tooltip: 'GDP (current US$)'
          },
          'AG.LND.TOTL.K2' => {
            name: 'Land area',
            suffix: 'km2',
            tooltip: 'Land area (sq. km)'
          },
          'AG.LND.AGRI.K2' => {
            name: 'Agricultural land area',
            suffix: 'km2',
            tooltip: 'Agricultural land (sq. km)'
          },
          'AG.LND.FRST.K2' => {
            name: 'Forested land area',
            suffix: 'km2',
            tooltip: 'Forest area (sq. km)'
          },
          'UNDP.HDI.XD' => {
            name: 'Human Development Index',
            tooltip: 'Human Development Index'
          }
        }.freeze

        COMTRADE_ATTRIBUTES = {
          value: {
            name: 'Value of agricultural %{trade_flow}s',
            prefix: '$',
            tooltip: 'Value of agricultural %{trade_flow}s ($)'
          },
          quantity: {
            name: 'Netweight',
            suffix: 'kg',
            tooltip: 'Netweight (kg)'
          }
        }.freeze
      end
    end
  end
end
