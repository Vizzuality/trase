module Api
  module Private
    class TopProfileImageSerializer < ActiveModel::Serializer
      attributes :image_url
    end
  end
end
