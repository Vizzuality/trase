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
        object&.top_profile_image&.image&.url
      end
    end
  end
end
