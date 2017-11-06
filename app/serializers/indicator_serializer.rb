class IndicatorSerializer < ActiveModel::Serializer
  attributes :name, :unit, :unit_type, :tooltip, :frontend_name, :indicator_type

  def unit
    object.unit unless object.is_a?(Qual)
  end

  def unit_type
    object.unit_type unless object.is_a?(Qual)
  end

  def indicator_type
    object.class.name
  end
end
