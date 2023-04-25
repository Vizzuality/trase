module Api
  module V3
    class DownloadAttributesController < ApiController
      def index
        @attributes = Api::V3::Readonly::DownloadAttribute.
          preload(:readonly_attribute).
          where(context_id: @context.id)
        render json: @attributes,
               each_serializer: Api::V3::DownloadAttributeSerializer,
               root: "indicators"
      end
    end
  end
end
