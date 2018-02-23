module Api
  module V3
    module Nodes
      class NodeAttributesSerializer < ActiveModel::Serializer
        attributes :node_id, :attribute_id, :attribute_type, :value,
                   :dual_layer_bucket, :single_layer_bucket
      end
    end
  end
end
