module Api
  module V3
    module CountriesWbIndicators
      module IndicatorsList
        ATTRIBUTES = {
          population: {
            short_name: :population,
            wb_name: 'SP.POP.TOTL',
            name: 'Population',
            suffix: 'people',
            tooltip: 'Population, total'
          },
          gdp: {
            short_name: :gdp,
            wb_name: 'NY.GDP.MKTP.CD',
            name: 'GDP',
            prefix: '$',
            tooltip: 'GDP (current US$)'
          },
          land_area: {
            short_name: :land_area,
            wb_name: 'AG.LND.TOTL.K2',
            name: 'Land area',
            suffix: 'km2',
            tooltip: 'Land area (sq. km)'
          },
          agricultural_land_area: {
            short_name: :agricultural_land_area,
            wb_name: 'AG.LND.AGRI.K2',
            name: 'Agricultural land area',
            suffix: 'km2',
            tooltip: 'Agricultural land (sq. km)'
          },
          forested_land_area: {
            short_name: :forested_land_area,
            wb_name: 'AG.LND.FRST.K2',
            name: 'Forested land area',
            suffix: 'km2',
            tooltip: 'Forest area (sq. km)'
          }
        }.freeze
      end
    end
  end
end
