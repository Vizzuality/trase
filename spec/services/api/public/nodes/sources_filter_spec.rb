require 'rails_helper'

RSpec.describe Api::Public::Nodes::Sources::Filter do
  include_context 'api v3 brazil flows'
  include_context 'api v3 brazil beef flows'

  before(:each) do
    Api::V3::Readonly::Context.refresh(sync: true)
    Api::V3::Readonly::FlowNode.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlowsPerYear.refresh(sync: true)
    Api::V3::Readonly::NodeWithFlows.refresh(sync: true)
  end

  describe :call do
    context 'when filtering by country' do
      let(:filter) {
        Api::Public::Nodes::Sources::Filter.new(
          commodity_id: api_v3_soy.id
        )
      }
      it 'returns nodes with availability by commodity' do
        nodes = filter.call
        amazonia = nodes.find { |n| n[:id] == api_v3_biome_node.id }
        expect(amazonia[:availability]).not_to be_empty
      end
    end
    context 'when filtering by name' do
      let(:filter) {
        Api::Public::Nodes::Sources::Filter.new(
          name: 'GRO'
        )
      }

      it 'matches on any word' do
        nodes = filter.call

        mato_idx = nodes.index { |n| n[:id] == api_v3_state_node.id }

        expect(mato_idx).not_to be_nil
      end
    end
  end
end
