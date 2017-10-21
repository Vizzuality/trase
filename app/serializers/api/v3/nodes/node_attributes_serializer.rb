module Api
  module V3
    module Nodes
      class NodeAttributesSerializer < ActiveModel::Serializer
        attributes :node_id, :attribute_id, :attribute_type, :value, :bucket3, :bucket5
      end
    end
  end
end
