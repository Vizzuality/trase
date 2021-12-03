module Api
  module V3
    class AttributeSerializer < ActiveModel::Serializer
      attributes :id, :display_name, :unit, :unit_type, :aggregation_method, :power_of_ten_for_rounding, :tooltip_text
    end
  end
end
