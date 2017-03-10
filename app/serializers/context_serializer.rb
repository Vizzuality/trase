class ContextSerializer < ActiveModel::Serializer
  attributes :id, :is_default, :years, :default_year
end
