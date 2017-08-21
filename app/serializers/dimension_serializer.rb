class DimensionSerializer < ActiveModel::Serializer
  attributes :id, :name, :type, :bucket_3, :bucket_5, :group_id, :unit, :is_default, :layer_attribute_id, :description, :color_scale, :years
end
