class LinkedGeoIdsSerializer < ActiveModel::Serializer
  attributes :node_id, :geo_id, :main_node_id, :name, :node_type_id, :is_domestic_consumption, :is_unknown

  # TODO: workaround to enforce either true or false. Can be removed once old schema is dropped
  attribute :is_domestic_consumption do
    object.is_domestic_consumption.present?
  end

  # TODO: workaround to enforce either true or false. Can be removed once old schema is dropped
  attribute :is_unknown do
    object.is_unknown.present?
  end
end
