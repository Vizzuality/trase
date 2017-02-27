class LayerSerializer < ActiveModel::Serializer
  attributes :id, :name, :type, :bucket_3, :bucket_5, :group_id, :unit, :is_default, :attribute_id
end
