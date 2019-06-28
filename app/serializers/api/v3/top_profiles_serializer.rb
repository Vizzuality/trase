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
        # placeholder image
        'https://imgplaceholder.com/420x320/ff7f7f/333333/fa-image'
      end
    end
  end
end
