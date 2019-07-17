module Api
  module V3
    class TopProfilesSerializer < ActiveModel::Serializer
      attributes :context_id, :node_id, :profile_type, :year, :summary
      attribute :photo_url
      attribute :node_name
      attribute :node_type

      def node_name
        object.node.name
      end

      def node_type
        object.node.node_type.name
      end

      def photo_url
        if object.top_profile_image
          object.top_profile_image.image.url
        else
          top_profile = Api::V3::TopProfile.includes(:context).find(object.id)
          Api::V3::TopProfiles::GetMatchingImage.call(top_profile)
        end
      end
    end
  end
end
