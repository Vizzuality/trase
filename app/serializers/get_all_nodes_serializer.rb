class GetAllNodesSerializer < ActiveModel::Serializer
  attributes :id, :name, :type
  attribute :column_id, key: 'columnId'
  attribute :geo_id, key: 'gedId'
  attribute :has_flows, key: 'hasFlows'

  def columnId
    object.column_id
  end
end
