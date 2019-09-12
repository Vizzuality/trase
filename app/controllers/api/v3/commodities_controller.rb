module Api
  module V3
    class CommoditiesController < ApiController
      include Api::V3::ParamHelpers

      skip_before_action :load_context
      before_action :load_commodity, only: [:countries_facts]
      before_action :set_collection, only: [:index]

      def index
        render json: @collection,
               each_serializer: Api::V3::Dashboards::CommoditySerializer
      end

      def countries_facts
        facts = Api::V3::SupplyChainCountriesFacts.new(
          @commodity.id
        )

        serialized_attributes = ActiveModelSerializers::SerializableResource.new(
          facts.attributes,
          each_serializer: Api::V3::AttributeSerializer,
          root: :attributes
        )

        render json: facts.facts,
               each_serializer: Api::V3::Commodities::CountryFactsSerializer,
               root: :data,
               meta: serialized_attributes
      end

      private

      def set_collection
        @collection = Api::V3::FilterCommodities.new(filter_params).call
      end

      def filter_params
        {
          countries_ids: cs_string_to_int_array(params[:countries_ids]),
          commodities_ids: cs_string_to_int_array(params[:commodities_ids]),
          include: params[:include]
        }
      end

      def load_commodity
        @commodity = Api::V3::Commodity.find(params[:id])
      end
    end
  end
end
