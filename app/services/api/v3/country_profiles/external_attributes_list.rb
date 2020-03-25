module Api
  module V3
    module CountryProfiles
      class ExternalAttributesList
        include Singleton

        # @param attribute_refs [Array<Hash>]
        # e.g. [{source: :wb, id: 'WB SP.POP.TOTL'}]
        def call(attribute_refs)
          attribute_refs.map do |ref|
            if ref[:source] == :wb
              WB_ATTRIBUTES[ref[:id]]
            else
              COMTRADE_ATTRIBUTES[ref[:id]]
            end
          end
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
          }
        }.freeze

        COMTRADE_ATTRIBUTES = {
          'trade_value' => {
            name: 'Value of agricultural #{trade_flow}s',
            prefix: '$',
            tooltip: 'TODO'
          },
          'netweight' => {
            name: 'Netweight',
            suffix: 'kg',
            tooltip: 'TODO'
          }
        }.freeze
      end
    end
  end
end
