module Api
  module V3
    class LinkedNodeSerializer < ActiveModel::Serializer
      attribute :id, key: :node_id
      attribute :main_id, key: :main_node_id
      attributes :geo_id, :name, :node_type_id, :is_unknown

      attribute :is_domestic_consumption do
        object["is_domestic_consumption"]
      end
    end
  end
end
