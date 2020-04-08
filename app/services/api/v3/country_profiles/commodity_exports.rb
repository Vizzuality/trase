module Api
  module V3
    module CountryProfiles
      class CommodityExports < Api::V3::CountryProfiles::CommodityTotals
        # @param node [Api::V3::Readonly::NodeWithFlows]
        # @param year [Integer]
        def initialize(node, year)
          super(
            node,
            year,
            {
              profile_type: Api::V3::Profile::COUNTRY,
              chart_identifier: :country_commodity_exports
            }
          )
        end

        private

        def included_columns
          [
            {
              name: 'World export ranking',
            },
            {
              name: 'Production',
              unit: @volume_attribute.unit
            },
            {
              name: 'Exports'
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
