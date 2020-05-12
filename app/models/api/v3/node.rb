# == Schema Information
#
# Table name: nodes
#
#  id                                                                                                      :integer          not null, primary key
#  node_type_id                                                                                            :integer          not null
#  name(Name of node)                                                                                      :text             not null
#  geo_id(2-letter iso code in case of country nodes; other geo identifiers possible for other node types) :text
#  is_unknown(When set, node was not possible to identify)                                                 :boolean          default(FALSE), not null
#  main_id(Node identifier from Main DB)                                                                   :integer
#
# Indexes
#
#  nodes_node_type_id_idx  (node_type_id)
#
# Foreign Keys
#
#  fk_rails_...  (node_type_id => node_types.id) ON DELETE => cascade
#
module Api
  module V3
    class Node < BlueTable
      belongs_to :node_type
      has_one :node_property
      has_many :node_inds
      has_many :node_quals
      has_many :node_quants

      has_many :dashboard_template_companies
      has_many :dashboard_templates, through: :dashboard_template_companies

      has_many :dashboard_template_destinations
      has_many :dashboard_templates, through: :dashboard_template_destinations

      has_many :dashboard_template_sources
      has_many :dashboard_templates, through: :dashboard_template_sources
      has_many :top_profiles

      has_many :nodes_stats

      has_many :sankey_card_links
      has_many :sankey_card_link_nodes
      has_many :sankey_card_links, through: :sankey_card_link_nodes

      def stringify
        name + ' - ' + node_type.name + ' - ' + node_type&.context_node_types&.first&.context&.country&.name + ' ' + node_type&.context_node_types&.first&.context&.commodity&.name
      end

      def self.select_options
        order(:name).map { |node| [node.name, node.id] }
      end

      def self.import_key
        [
          {name: :name, sql_type: 'TEXT'},
          {name: :main_id, sql_type: 'INT'},
          {name: :node_type_id, sql_type: 'INT'}
        ]
      end

      def self.blue_foreign_keys
        [
          {name: :node_type_id, table_class: Api::V3::NodeType}
        ]
      end

      # TODO: ???
      def readonly_attribute
        Api::V3::Readonly::NodeWithFlows.find(id)
      rescue ActiveRecord::RecordNotFound
        nil
      end
    end
  end
end
