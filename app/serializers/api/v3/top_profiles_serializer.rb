module Api
  module V3
    class TopProfilesSerializer < ActiveModel::Serializer
      attributes :context_id, :node_id
      attribute :profile_type
      attribute :photo_url
      attribute :year
      attribute :summary

      def profile_type
        object.node.node_type.context_node_types.find_by(context_id: object.context_id).profile.name
      end

      def year
        object.context.years.max
      end

      def summary
        service =
          "Api::V3::#{profile_type.pluralize.capitalize}::BasicAttributes".constantize
        service.new(
          object.context, object.node, year
        ).call[:summary]
      end

      def photo_url
        # placeholder image
        'https://imgplaceholder.com/420x320/ff7f7f/333333/fa-image'
      end
    end
  end
end
