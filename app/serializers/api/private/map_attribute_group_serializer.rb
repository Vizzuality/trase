module Api
  module Private
    class MapAttributeGroupSerializer < ActiveModel::Serializer
      attributes  :name
                  :position

      has_many :map_attributes, serializer: Api::Private::MapAttributeSerializer
    end
  end
end
