module Api
  module Private
    class TopProfileSerializer < ActiveModel::Serializer
      attributes :year, :profile_type, :summary
      belongs_to :node, serializer: Api::Private::NodeRefSerializer
      belongs_to :top_profile_image, serializer: Api::Private::TopProfileImageSerializer
    end
  end
end
