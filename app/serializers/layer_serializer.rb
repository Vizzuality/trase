class LayerSerializer < ActiveModel::Serializer
  attributes :id, :name, :type, :bucket_3, :bucket_5, :folder_id, :unit, :is_default
end
