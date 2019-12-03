require 'rails_helper'

RSpec.describe Api::V3::SankeyCardLinkNode, type: :model do
  include_context 'api v3 brazil flows'
  include_context 'api v3 brazil beef nodes'
  include_context 'api v3 brazil flows quals'
  include_context 'api v3 brazil resize by attributes'
  include_context 'api v3 brazil beef context node types'

  before do
    Api::V3::Readonly::Attribute.refresh(sync: true, skip_dependents: true)
  end

  let(:sankey_card_link) do
    sankey_card_link = FactoryBot.build(:api_v3_sankey_card_link)
    sankey_card_link.query_params['selectedNodesIds'] =
      [api_v3_brazil_beef_country_of_production_node.id]
    sankey_card_link.save

    sankey_card_link
  end

  describe :callbacks do
    describe 'after_commit' do
      describe '#update_query_params' do
        it 'update "selectedNodesIds" on query_params attribute of Sankey card links' do
          Api::V3::SankeyCardLinkNode.find_or_create_by!(
            node_id: api_v3_country_of_destination_node.id,
            sankey_card_link_id: sankey_card_link.id
          )

          sankey_card_link.reload
          expect(sankey_card_link.query_params).to include('selectedNodesIds' => [
            api_v3_brazil_beef_country_of_production_node.id,
            api_v3_country_of_destination_node.id
          ])
        end
      end
    end
  end
end
