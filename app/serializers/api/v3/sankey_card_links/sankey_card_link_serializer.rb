module Api
  module V3
    module SankeyCardLinks
      class SankeyCardLinkSerializer < ActiveModel::Serializer
        attributes :id,
                   :host,
                   :query_params,
                   :link
      end

      class NodeSerializer < ActiveModel::Serializer
        attribute :node_id, key: :id
        attribute :node_type do
          object.node&.node_type&.name
        end
      end

      class ColumnSerializer < ActiveModel::Serializer
        attribute :column_group
        attribute :node_type_id
        attribute :role do
          object.context_node_type_property.role
        end
      end
    end
  end
end
