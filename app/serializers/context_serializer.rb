class ContextSerializer < ActiveModel::Serializer
  attributes :id, :is_default, :years, :default_year

  # TODO: workaround to enforce either true or false. Can be removed once old schema is dropped
  attribute :is_default do
    object.is_default.present?
  end
end
