module Api
  module Private
    class ChartSerializer < ActiveModel::Serializer
      attributes :identifier, :title, :position
      has_many :children, serializer: Api::Private::ChartSerializer
      has_many :chart_attributes, serializer: Api::Private::ChartAttributeSerializer
      has_many :chart_node_types, serializer: Api::Private::ChartNodeTypeSerializer
    end
  end
end
