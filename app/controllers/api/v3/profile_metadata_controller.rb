module Api
  module V3
    class ProfileMetadataController < ApiController
      before_action :load_node

      def index
        @result = Api::V3::ProfileMetadata::ResponseBuilder.new(
          @context, @node
        ).call

        render json: {data: @result}
      end

      private

      def load_node
        ensure_required_param_present(:id)
        @node = Api::V3::Node.profile_nodes.find(params[:id])
      end
    end
  end
end
