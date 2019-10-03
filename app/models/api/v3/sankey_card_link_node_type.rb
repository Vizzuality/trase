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

      validates :sankey_card_link_id, uniqueness: {scope: :node_type_id}
    end
  end
end
