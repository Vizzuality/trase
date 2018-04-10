module Api
  module V3
    module NodesSearch
      class NodeSerializer < ActiveModel::Serializer
        attributes :id, :name, :node_type, :context_id, :profile
      end
    end
  end
end
