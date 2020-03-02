module Api
  module V3
    class ProfileMetadataController < ApiController
      before_action :load_node

      def index
        @result = Api::V3::ProfileMetadata::ResponseBuilder.new(
          @context, @node
        ).call

        serialized_profile_metadata =
          ActiveModelSerializers::SerializableResource.new(
            @result,
            serializer: Api::V3::ProfileMetadata::ProfileSerializer,
            key_transform: :underscore,
            root: 'data',
            include: [:context_node_type, {charts: :children}]
          ).serializable_hash

        serialized_available_years =
          ActiveModelSerializers::SerializableResource.new(
            @readonly_node,
            root: 'data',
            serializer: Api::V3::ProfileMetadata::AvailableYearsSerializer,
            key_transform: :underscore
          ).serializable_hash

        render json: {
          data: serialized_profile_metadata[:data].merge(
            serialized_available_years[:data]
          )
        }
      end

      private

      def load_node
        ensure_required_param_present(:id)

        @node = Api::V3::Node.find(params[:id])

        @readonly_node = Api::V3::Readonly::NodeWithFlows.
          where(
            context_id: @context.id,
            profile: Api::V3::Profile::NAMES
          ).
          find(@node.id)
      end
    end
  end
end
