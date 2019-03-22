module Api
  module V3
    module Contexts
      class RecolorByAttributeSerializer < ActiveModel::Serializer
        attributes :is_default, :is_disabled, :group_number, :position,
                   :legend_type, :legend_color_theme, :interval_count,
                   :min_value, :max_value, :divisor, :name, :years
        attribute :display_name, key: :label
        attribute :tooltip_text, key: :description

        attribute :type do
          object.original_type.downcase
        end

        attribute :nodes do
          next [] unless object.legend_type.eql? 'qual'

          object.legend
        end
      end
    end
  end
end
