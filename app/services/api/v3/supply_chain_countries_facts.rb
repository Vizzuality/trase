module Api
  module V3
    class SupplyChainCountryFacts < ActiveModelSerializers::Model
      attr_reader :country_id, :facts
      def initialize(country_id, facts)
        @country_id = country_id
        @facts = facts
      end
    end

    class SupplyChainCountriesFacts
      # @param commodity_id [Integer]
      def initialize(commodity_id)
        @commodity_id = commodity_id
        @query = Api::V3::Readonly::FlowQuantTotal.
          with_attribute_id.
          where(commodity_id: @commodity_id)
      end

      def facts
        @query.all.group_by(&:country_id).map do |country_id, facts|
          SupplyChainCountryFacts.new(country_id, facts)
        end
      end

      def attributes
        Api::V3::Readonly::Attribute.
          select(:id, :display_name, :unit, :unit_type, :aggregation_method, :power_of_ten_for_rounding, :tooltip_text).
          find(@query.map(&:attribute_id))
      end
    end
  end
end
