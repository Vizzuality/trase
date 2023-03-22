module Api
  module V3
    class MethodsAndDataDocsController < ApiController
      skip_before_action :load_context

      def index
        @result = Api::V3::MethodsAndDataDoc.
          includes(context: [:country, :commodity, :context_property]).
          order("countries.name", "commodities.name")

        render json: @result, each_serializer: Api::V3::MethodsAndDataDocSerializer, root: :data
      end
    end
  end
end
