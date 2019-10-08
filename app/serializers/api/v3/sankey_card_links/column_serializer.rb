module Api
  module V3
    module SankeyCardLinks
      class ColumnSerializer < ActiveModel::Serializer
        attribute :column_group
        attribute :node_type_id
        attribute :node_type do
          object.node_type&.name
        end
        attribute :role do
          object.context_node_type_property.role
        end
      end
    end
  end
end
