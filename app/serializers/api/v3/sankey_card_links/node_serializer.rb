module Api
  module V3
    module SankeyCardLinks
      class NodeSerializer < ActiveModel::Serializer
        attribute :node_id, key: :id
        attribute :node_type_id do
          object.node&.node_type_id
        end
      end
    end
  end
end
