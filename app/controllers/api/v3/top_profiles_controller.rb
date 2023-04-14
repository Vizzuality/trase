module Api
  module V3
    class TopProfilesController < ApiController
      skip_before_action :load_context

      def index
        top_profiles = Api::V3::TopProfile.includes(node: :node_type)
        if params[:context_id].present?
          top_profiles = top_profiles.where(context_id: params[:context_id])
        end

        render json: top_profiles,
               root: "data",
               each_serializer: Api::V3::TopProfilesSerializer
      end
    end
  end
end
