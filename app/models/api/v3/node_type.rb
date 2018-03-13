# == Schema Information
#
# Table name: node_types
#
#  id         :integer          not null, primary key
#  name       :text             not null
#  created_at :datetime         not null
#
# Indexes
#
#  node_types_name_key  (name) UNIQUE
#

module Api
  module V3
    class NodeType < BlueTable
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
        zero_based_idx = ContextNodeType.
          joins(:node_type).
          where(context_id: context.id).
          where('node_types.name' => node_type_name).
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

      def self.import_key
        [
          {name: :name, sql_type: 'TEXT'}
        ]
      end
    end
  end
end
