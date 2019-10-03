# == Schema Information
#
# Table name: sankey_card_link_nodes
#
#  id                  :bigint(8)        not null, primary key
#  sankey_card_link_id :bigint(8)
#  node_id             :bigint(8)
#
# Indexes
#
#  index_sankey_card_link_nodes_on_node_id              (node_id)
#  index_sankey_card_link_nodes_on_sankey_card_link_id  (sankey_card_link_id)
#
# Foreign Keys
#
#  fk_rails_...  (node_id => nodes.id)
#  fk_rails_...  (sankey_card_link_id => sankey_card_links.id)
#

module Api
  module V3
    class SankeyCardLinkNode < YellowTable
      belongs_to :sankey_card_link,
                 class_name: 'Api::V3::SankeyCardLink',
                 inverse_of: :sankey_card_link_nodes
      belongs_to :node,
                 class_name: 'Api::V3::Node',
                 inverse_of: :sankey_card_link_nodes

      validates :sankey_card_link_id, uniqueness: {scope: :node_id}
    end
  end
end
