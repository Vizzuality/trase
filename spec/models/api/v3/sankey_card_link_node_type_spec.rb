require 'rails_helper'

RSpec.describe Api::V3::SankeyCardLinkNodeType, type: :model do
  include_context 'api v3 brazil flows'
  include_context 'api v3 brazil beef nodes'
  include_context 'api v3 brazil flows quals'
  include_context 'api v3 brazil resize by attributes'
  include_context 'api v3 brazil beef context node types'

  before do
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
  end

  let(:sankey_card_link) { FactoryBot.create(:api_v3_sankey_card_link) }

  describe :callbacks do
    describe 'after_commit' do
      describe '#update_query_params' do
        it 'update "selectedColumnsIds" on query_params attribute of Sankey card links' do
          context_id = Api::V3::Context.find_by(
            country_id: sankey_card_link.country_id,
            commodity_id: sankey_card_link.commodity_id
          )
          node_type_id = api_v3_brazil_beef_port_of_export_context_node_type.
            node_type_id
          context_node_type_property_id = Api::V3::NodeType.
            select('context_node_type_properties.id AS context_node_type_property_id').
            joins('JOIN context_node_types ON context_node_types.node_type_id = node_types.id').
            joins('JOIN context_node_type_properties ON context_node_type_properties.context_node_type_id = context_node_types.id').
            find_by(
              'node_types.id': node_type_id,
              'context_node_types.context_id': context_id,
              'context_node_type_properties.column_group': 1
            )&.context_node_type_property_id
          Api::V3::SankeyCardLinkNodeType.find_or_create_by!(
            column_group: 1,
            sankey_card_link_id: sankey_card_link.id,
            context_node_type_property_id: context_node_type_property_id
          )

          sankey_card_link.reload
          expect(sankey_card_link.query_params['selectedColumnsIds']).to include(
            "1_#{node_type_id}"
          )
        end
      end
    end
  end
end
