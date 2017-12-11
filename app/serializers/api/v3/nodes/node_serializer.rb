module Api
  module V3
    module Nodes
      class NodeSerializer < ActiveModel::Serializer
        attribute :main_id, key: :main_node_id
        attributes :id, :name, :type, :column_id, :geo_id,
                   :is_domestic_consumption, :is_unknown, :profile_type,
                   :has_flows

        attribute :is_aggregated do
          object.name.casecmp('other').zero?
        end
      end
    end
  end
end
