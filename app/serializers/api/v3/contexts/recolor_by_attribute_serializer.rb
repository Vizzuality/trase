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
          flows = []
          if object.legend_type.eql? 'qual'
            FlowQual.distinct.select('value').
              where(
                'qual_id = ? AND value NOT LIKE \'UNKNOWN%\'',
                object.original_id
              ).each do |flow|
              flows.push(flow.value)
            end
          end
          flows
        end
      end
    end
  end
end
