module Api
  module V3
    class TopProfilesSerializer < ActiveModel::Serializer
      attributes :context_id, :node_id, :profile_type, :year, :summary
      attribute :photo_url
      attribute :node_name
      attribute :node_type

      SIZE = :large

      def node_name
        object.node.name
      end

      def node_type
        object.node.node_type.name
      end

      def photo_url
        url =
          if object.top_profile_image
            object.top_profile_image.image.url(SIZE)
          else
            top_profile = Api::V3::TopProfile.includes(:context).find(object.id)
            Api::V3::TopProfiles::GetMatchingImage.call(top_profile, SIZE)
          end
        return url if Rails.env.development? || Rails.env.test?

        '/content' + url
      end
    end
  end
end
