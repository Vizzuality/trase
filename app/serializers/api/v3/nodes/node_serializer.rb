module Api
  module V3
    module Nodes
      class NodeSerializer < ActiveModel::Serializer
        attribute :main_id, key: :main_node_id
        attribute :aggregated?, key: :is_aggregated
        attributes :id, :name, :type, :column_id, :geo_id,
                   :has_flows, :is_domestic_consumption,
                   :is_unknown, :profile_type

        def aggregated?
          object.name.casecmp('other').zero?
        end
      end
    end
  end
end
