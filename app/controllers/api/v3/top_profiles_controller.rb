module Api
  module V3
    class TopProfilesController < ApiController
      def index
        @top_profiles = Api::V3::TopProfile.where(context_id: params[:context_id])

        render json: @top_profiles, root: 'data',
               each_serializer: Api::V3::TopProfilesSerializer
      end
    end
  end
end
