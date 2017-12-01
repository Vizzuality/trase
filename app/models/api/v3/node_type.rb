module Api
  module V3
    class NodeType < BaseModel
      has_many :context_node_types
      has_many :nodes

      def self.node_index_for_id(context, node_type_id)
        zero_based_idx = Api::V3::ContextNodeType.
          where(context_id: context.id).
          where(node_type_id: node_type_id).
          pluck(:column_position).first
        zero_based_idx && zero_based_idx + 1 || 0
      end
    end
  end
end
