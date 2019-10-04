# == Schema Information
#
# Table name: sankey_card_link_node_types
#
#  id                            :bigint(8)        not null, primary key
#  context_node_type_property_id :bigint(8)
#  sankey_card_link_id           :bigint(8)
#  node_type_id                  :bigint(8)
#  column_group                  :integer          not null
#
# Indexes
#
#  index_sankey_card_link_node_types_on_node_type_id              (node_type_id)
#  index_sankey_card_link_node_types_on_sankey_card_link_id       (sankey_card_link_id)
#  sankey_card_link_node_types_context_node_type_property_id_idx  (context_node_type_property_id)
#
# Foreign Keys
#
#  fk_rails_...  (context_node_type_property_id => context_node_type_properties.id)
#  fk_rails_...  (node_type_id => node_types.id)
#  fk_rails_...  (sankey_card_link_id => sankey_card_links.id)
#

module Api
  module V3
    class SankeyCardLinkNodeType < YellowTable
      belongs_to :context_node_type_property
      belongs_to :sankey_card_link,
                 class_name: 'Api::V3::SankeyCardLink',
                 inverse_of: :sankey_card_link_node_types
      belongs_to :node_type,
                 class_name: 'Api::V3::NodeType',
                 inverse_of: :sankey_card_link_node_types

      validates :column_group,
                presence: true,
                inclusion: 0..3,
                uniqueness: {scope: :sankey_card_link_id}
      validates :sankey_card_link_id, uniqueness: {scope: :node_type_id}
    end
  end
end
