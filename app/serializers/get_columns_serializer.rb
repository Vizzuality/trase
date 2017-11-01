class GetColumnsSerializer < ActiveModel::Serializer
  attributes :id, :name, :position, :group, :is_default, :is_geo, :profile_type

  # TODO: workaround to enforce either true or false. Can be removed once old schema is dropped
  attribute :is_default do
    object.is_default.present?
  end

  # TODO: workaround to enforce either true or false. Can be removed once old schema is dropped
  attribute :is_geo do
    object.is_geo.present?
  end
end
