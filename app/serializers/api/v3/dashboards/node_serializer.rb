module Api
  module V3
    module Dashboards
      class NodeSerializer < ActiveModel::Serializer
        attributes :id, :name, :node_type_id, :country_id
        attribute :node_type do
          object["node_type"]
        end
      end
    end
  end
end
