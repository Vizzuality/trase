module Api
  module Private
    class ResizeByAttributeSerializer < ActiveModel::Serializer
      attributes  :group_number,
                  :position,
                  :tooltip_text,
                  :years,
                  :is_disabled,
                  :is_default,
                  :is_quick_fact

      has_one :resize_by_quant, serializer: Api::Private::ResizeByQuantSerializer
    end
  end
end
