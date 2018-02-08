module Content
  class SiteDiveSerializer < ActiveModel::Serializer
    attributes :title, :description
  end
end
