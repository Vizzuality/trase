module Api
  module V3
    class AttributeSerializer < ActiveModel::Serializer
      attributes :id, :display_name, :unit, :tooltip_text
    end
  end
end
