class GetContextsSerializer < ActiveModel::Serializer
  attributes :id, :is_default, :country_name, :commodity_name, :years, :default_year
end
