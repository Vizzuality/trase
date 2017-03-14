class IndicatorSerializer < ActiveModel::Serializer
  attributes :name, :unit, :unit_type, :tooltip, :frontend_name, :indicator_type

  def unit
    unless object.is_a?(Qual)
      object.unit
    end
  end

  def unit_type
    unless object.is_a?(Qual)
      object.unit_type
    end
  end

  def indicator_type
    object.class.name
  end
end