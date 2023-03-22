module Api
  module V3
    module Contexts
      class RecolorByAttributeSerializer < ActiveModel::Serializer
        attributes :is_default, :is_disabled, :group_number, :position,
                   :legend_type, :legend_color_theme, :interval_count,
                   :min_value, :max_value, :divisor, :name, :years,
                   :attribute_id
        attribute :display_name, key: :label do
          name_and_tooltip.display_name
        end

        attribute :tooltip_text, key: :description do
          name_and_tooltip.tooltip_text
        end

        def name_and_tooltip
          return @name_and_tooltip if defined?(@name_and_tooltip)

          @name_and_tooltip = Api::V3::AttributeNameAndTooltip.call(
            attribute: object.readonly_attribute,
            context: object.context,
            defaults: Api::V3::AttributeNameAndTooltip::NameAndTooltip.new(object.display_name, object.tooltip_text)
          )
        end

        attribute :type do
          object.original_type.downcase
        end

        attribute :nodes do
          next [] unless object.legend_type.eql? "qual"

          object.legend
        end
      end
    end
  end
end
