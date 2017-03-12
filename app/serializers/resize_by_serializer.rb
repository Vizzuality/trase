class ResizeBySerializer < ActiveModel::Serializer
  attributes :is_default, :is_disabled, :group_number, :position

  attribute :name do
    object.resize_attribute.name
  end

  attribute :label do
    object.resize_attribute.frontend_name
  end
end
