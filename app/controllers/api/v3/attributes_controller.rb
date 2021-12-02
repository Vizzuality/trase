module Api
  module V3
    class AttributesController < ApiController
      skip_before_action :load_context

      def index
        @result = Api::V3::Readonly::Attribute.order(:display_name)

        render json: @result, each_serializer: Api::V3::AttributeSerializer, root: :data
      end
    end
  end
end
