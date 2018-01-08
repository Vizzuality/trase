module Api
  module V3
    class NodeType < BaseModel
      has_many :context_node_types
      has_many :nodes

      PLACES = [
        NodeTypeName::MUNICIPALITY,
        NodeTypeName::LOGISTICS_HUB,
        NodeTypeName::BIOME,
        NodeTypeName::STATE
      ].freeze

      ACTORS = [
        NodeTypeName::EXPORTER,
        NodeTypeName::IMPORTER
      ].freeze

      def self.node_index_for_name(context, node_type_name)
        zero_based_idx = ContextNode.
          joins(:node_type).
          where(context_id: context.id).
          where('node_types.node_type' => node_type_name).
          pluck(:column_position).first
        zero_based_idx && zero_based_idx + 1 || 0
      end

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
