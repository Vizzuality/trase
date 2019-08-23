module Api
  module V3
    module Profiles
      class TopDestinationsForCommodityList < TopDestinationsList
        def initialize(commodity_id, data)
          super(data)

          @commodity_id = commodity_id
        end

        private

        def query_all_years(attribute, options = {})
          super(attribute, options).
            joins('INNER JOIN contexts ON contexts.id = flows.context_id').
            joins('INNER JOIN commodities ON commodities.id = contexts.commodity_id').
            where('commodities.id': @commodity_id)
        end
      end
    end
  end
end
