module Api
  module V3
    module CountryProfiles
      class CommodityImports < Api::V3::CountryProfiles::CommodityTotals
        # @param node [Api::V3::Readonly::NodeWithFlows]
        # @param year [Integer]
        def initialize(node, year)
          super(
            node,
            year,
            {
              profile_type: Api::V3::Profile::COUNTRY,
              chart_identifier: :country_commodity_imports
            }
          )
        end

        private

        def included_columns
          [
            {
              name: 'World import ranking',
            },
            {
              name: 'Production',
              unit: @volume_attribute.unit
            },
            {
              name: 'Imports'
            },
            {
              name: 'Value'
            }
          ]
        end
      end
    end
  end
end
