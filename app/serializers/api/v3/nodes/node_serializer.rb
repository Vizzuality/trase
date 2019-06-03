module Api
  module V3
    module Nodes
      class NodeSerializer < ActiveModel::Serializer
        attribute :main_id, key: :main_node_id
        attribute :node_type_id, key: :column_id
        attribute :node_type, key: :type
        attributes :id,
                   :name,
                   :geo_id,
                   :is_domestic_consumption,
                   :is_unknown,
                   :profile_type,
                   :has_flows,
                   :is_aggregated
      end
    end
  end
end
