class GetAllNodesSerializer < ActiveModel::Serializer
  attributes :id, :name, :type, :column_id, :geo_id, :has_flows, :isAggregated, :is_domestic_consumption, :is_unknown, :profile_type

  def isAggregated
    object.name.casecmp('other').zero?
  end
end
