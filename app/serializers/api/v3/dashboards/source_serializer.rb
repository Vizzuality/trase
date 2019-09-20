module Api
  module V3
    module Dashboards
      class SourceSerializer < ActiveModel::Serializer
        attributes :id, :name
        attribute :node_type do
          object['node_type']
        end
      end
    end
  end
end
