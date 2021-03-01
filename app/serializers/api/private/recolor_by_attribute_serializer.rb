module Api
  module Private
    class RecolorByAttributeSerializer < ActiveModel::Serializer
      attributes  :group_number,
                  :position,
                  :legend_type,
                  :legend_color_theme,
                  :interval_count,
                  :min_value,
                  :max_value,
                  :divisor,
                  :tooltip_text,
                  :years,
                  :is_disabled,
                  :is_default
      has_one :recolor_by_ind, serializer: Api::Private::RecolorByIndSerializer
      has_one :recolor_by_qual, serializer: Api::Private::RecolorByQualSerializer
    end
  end
end
