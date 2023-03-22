module Admin
  class SourceSearchSerializer < ActiveModel::Serializer
    attributes :id

    attribute :stringify do
      object.name + " - " + object.node_type + " - " + object.country_name + " " + object.commodity_name
    end
  end
end
