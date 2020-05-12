# == Schema Information
#
# Table name: node_types
#
#  id                                                                          :integer          not null, primary key
#  name(Name of node type, spelt in capital letters; unique across node types) :text             not null
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
      has_many :nodes_stats
      has_many :sankey_card_link_node_types
      has_many :sankey_card_links, through: :sankey_card_link_node_types

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

      def self.select_options
        order(:name).map { |node_type| [node_type.name, node_type.id] }
      end

      def self.import_key
        [
          {name: :name, sql_type: 'TEXT'}
        ]
      end
    end
  end
end
