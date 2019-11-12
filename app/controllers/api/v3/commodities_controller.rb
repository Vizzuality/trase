module Api
  module V3
    class CommoditiesController < ApiController
      skip_before_action :load_context
      before_action :load_commodity, only: [:countries_facts]

      def countries_facts
        facts = Api::V3::SupplyChainCountriesFacts.new(
          @commodity.id
        )

        serialized_attributes = ActiveModelSerializers::SerializableResource.new(
          facts.attributes,
          each_serializer: Api::V3::AttributeSerializer,
          root: 'attributes'
        )

        render json: facts.facts,
               each_serializer: Api::V3::Commodities::CountryFactsSerializer,
               root: 'data',
               meta: serialized_attributes
      end

      private

      def load_commodity
        @commodity = Api::V3::Commodity.find(params[:id])
      end
    end
  end
end
