module Api
  module V3
    class TopProfilesController < ApiController
      skip_before_action :load_context

      def index
        top_profiles =
          if params[:context_id].present?
            Api::V3::TopProfile.where(context_id: params[:context_id])
          else
            Api::V3::TopProfile.all
          end

        render json: top_profiles, root: 'data',
               each_serializer: Api::V3::TopProfilesSerializer
      end
    end
  end
end
