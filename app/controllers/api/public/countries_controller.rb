module Api
  module Public
    class CountriesController < ApiController
      include Api::V3::ParamHelpers

      skip_before_action :load_context
      before_action :set_collection, only: [:index]

      def index
        render json: @collection,
               each_serializer: Api::Public::CountrySerializer
      end

      private

      def set_collection
        @collection = Api::Public::FilterCountries.new(filter_params).call
      end

      def filter_params
        {
          countries_ids: cs_string_to_int_array(params[:countries_ids]),
          commodities_ids: cs_string_to_int_array(params[:commodities_ids]),
          include: params[:include]
        }
      end
    end
  end
end
