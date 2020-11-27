require 'rails_helper'

RSpec.describe Api::V3::NodeProperty, type: :model do
  include_context 'api v3 brazil soy nodes'

  describe :validate do
    let(:property_without_node) {
      FactoryBot.build(:api_v3_node_property, node: nil)
    }
    let(:duplicate) {
      FactoryBot.build(:api_v3_node_property, node: api_v3_state_node)
    }
    it 'fails when node missing' do
      expect(property_without_node).to have(2).errors_on(:node)
    end
    it 'fails when node taken' do
      expect(duplicate).to have(1).errors_on(:node)
    end
  end

  describe :update do
    before(:each) do
      Api::V3::NodeProperty.set_callback(:update, :after, :refresh_dependents_after_update)
    end
    after(:each) do
      Api::V3::NodeProperty.skip_callback(:update, :after, :refresh_dependents_after_update)
    end
    it 'refreshes nodes_with_flows_or_geo' do
      Api::V3::Readonly::FlowNode.refresh(
        sync: true, skip_dependents: true
      )
      Api::V3::Readonly::NodesPerContextRankedByVolumePerYear.refresh(
        sync: true, skip_dependents: true
      )
      Api::V3::Readonly::NodeWithFlowsOrGeo.refresh
      np = api_v3_state_node.node_property
      node = Api::V3::Readonly::NodeWithFlowsOrGeo.find_by(
        id: np.node_id, context_id: api_v3_brazil_soy_context.id
      )

      np.update_attributes(is_domestic_consumption: !node.is_domestic_consumption)

      node = Api::V3::Readonly::NodeWithFlowsOrGeo.find_by(
        id: np.node_id, context_id: api_v3_brazil_soy_context.id
      )

      expect(node.is_domestic_consumption).to eq(np.is_domestic_consumption)
    end
  end
end
