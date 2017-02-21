class GetColumnsSerializer < ActiveModel::Serializer
  attributes :id, :name, :position, :group, :is_default
end
