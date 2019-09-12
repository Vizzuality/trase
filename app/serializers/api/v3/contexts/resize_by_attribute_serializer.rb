module Api
  module V3
    module Contexts
      class ResizeByAttributeSerializer < ActiveModel::Serializer
        attributes :is_default, :is_disabled, :group_number, :position, :name,
                   :unit, :years, :attribute_id
        attribute :display_name, key: :label
        attribute :tooltip_text, key: :description
      end
    end
  end
end
