module Api
  module V3
    module SankeyCardLinks
      class NodeSerializer < ActiveModel::Serializer
        attribute :id
        attribute :node_type_id
      end
    end
  end
end
