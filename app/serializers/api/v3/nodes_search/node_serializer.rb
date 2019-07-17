module Api
  module V3
    module NodesSearch
      class NodeSerializer < ActiveModel::Serializer
        attributes :id,
                   :main_id,
                   :name,
                   :node_type,
                   :context_id,
                   :profile,
                   :is_subnational,
                   :years
      end
    end
  end
end
