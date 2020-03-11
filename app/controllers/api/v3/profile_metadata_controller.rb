module Api
  module V3
    class ProfileMetadataController < ApiController
      before_action :load_node_with_flows

      def index
        @result = Api::V3::Profiles::ProfileMeta.new(@node_with_flows, @context)

        render json: @result,
               root: 'data',
               key_transform: :underscore
      end

      private

      def load_node_with_flows
        ensure_required_param_present(:id)

        @node_with_flows = Api::V3::Readonly::NodeWithFlows.
          where(
            context_id: @context.id,
            profile: Api::V3::Profile::NAMES
          ).
          find(params[:id])
      end
    end
  end
end
