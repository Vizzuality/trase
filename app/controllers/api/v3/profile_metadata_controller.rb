module Api
  module V3
    class ProfileMetadataController < ApiController
      before_action :load_node

      def index
        @result = Api::V3::ProfileMetadata::ResponseBuilder.new(
          @context, @node
        ).call

        render json: @result,
               root: 'data',
               serializer: Api::V3::ProfileMetadata::ProfileSerializer,
               include: {charts: :children},
               key_transform: :underscore
      end

      private

      def load_node
        ensure_required_param_present(:id)
        @node = Api::V3::Node.find(params[:id])
      end
    end
  end
end
