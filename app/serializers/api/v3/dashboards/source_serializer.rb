module Api
  module V3
    module Dashboards
      class SourceSerializer < ActiveModel::Serializer
        attributes :id, :name, :parent_name, :parent_node_type
        attribute :node_type do
          object['node_type']
        end
      end
    end
  end
end
