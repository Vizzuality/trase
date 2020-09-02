module Api
  module V3
    module CountriesWbIndicators
      module IndicatorsList
        ATTRIBUTES = {
          population: {
            short_name: :population,
            wb_name: 'SP.POP.TOTL',
            name: 'Population',
            unit: 'people',
            unit_position: 'suffix',
            tooltip: 'Population, total'
          },
          gdp: {
            short_name: :gdp,
            wb_name: 'NY.GDP.MKTP.CD',
            name: 'GDP',
            unit: '$',
            unit_position: 'prefix',
            tooltip: 'GDP (current US$)'
          },
          land_area: {
            short_name: :land_area,
            wb_name: 'AG.LND.TOTL.K2',
            name: 'Land area',
            unit: 'km2',
            unit_position: 'suffix',
            tooltip: 'Land area (sq. km)'
          },
          agricultural_land_area: {
            short_name: :agricultural_land_area,
            wb_name: 'AG.LND.AGRI.K2',
            name: 'Agricultural land area',
            unit: 'km2',
            unit_position: 'suffix',
            tooltip: 'Agricultural land (sq. km)'
          },
          forested_land_area: {
            short_name: :forested_land_area,
            wb_name: 'AG.LND.FRST.K2',
            name: 'Forested land area',
            unit: 'km2',
            unit_position: 'suffix',
            tooltip: 'Forest area (sq. km)'
          }
        }.freeze
      end
    end
  end
end
