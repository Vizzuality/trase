class GetAllNodesSerializer < ActiveModel::Serializer
  attributes :id, :name, :type, :column_id, :geo_id, :has_flows
end
