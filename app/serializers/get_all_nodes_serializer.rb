class GetAllNodesSerializer < ActiveModel::Serializer
  attributes :id, :column_id, :geo_id, :name, :type, :has_flows
end
