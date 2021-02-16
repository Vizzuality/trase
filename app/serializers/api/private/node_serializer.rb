module Api
  module Private
    class NodeSerializer < ActiveModel::Serializer
      attributes :name, :main_id, :geo_id

      has_one :node_property, serializer: Api::Private::NodePropertySerializer
    end
  end
end
