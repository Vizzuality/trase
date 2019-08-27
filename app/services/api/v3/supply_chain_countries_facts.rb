module Api
  module V3
    class SupplyChainCountriesFacts
      # @param commodity_id [Integer]
      def initialize(commodity_id)
        @commodity_id = commodity_id
        @query = Api::V3::Readonly::FlowQuantTotal.
          with_attribute_id.
          where(commodity_id: @commodity_id)
      end

      def facts
        @query.all
      end

      def attributes
        Api::V3::Readonly::Attribute.
          select(:id, :display_name, :unit, :tooltip_text).
          find(@query.map(&:attribute_id))
      end
    end
  end
end
