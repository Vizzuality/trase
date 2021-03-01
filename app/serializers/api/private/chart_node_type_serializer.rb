module Api
  module Private
    class ChartNodeTypeSerializer < ActiveModel::Serializer
      attributes  :identifier,
                  :position,
                  :is_total
      belongs_to :node_type, serializer: Api::Private::NodeTypeRefSerializer
    end
  end
end
