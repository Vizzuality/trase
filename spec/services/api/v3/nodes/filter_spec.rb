require 'rails_helper'

RSpec.describe Api::V3::Nodes::Filter do
  include_context 'api v3 brazil flows quants'

  before(:each) do
    Api::V3::Readonly::SankeyNode.refresh(sync: true)
  end

  context 'when no params' do
    let(:result) { Api::V3::Nodes::Filter.new(api_v3_context, {}).call }

    it 'returns all nodes' do
      expect(result.size).to eq(Api::V3::Node.count)
    end
  end

  context 'when filtered by node type' do
    let(:result) {
      Api::V3::Nodes::Filter.new(
        api_v3_context, {node_types_ids: [api_v3_municipality_node.id]}
      ).call
    }

    it 'returns municipalities only' do
      expect(result.pluck(:id)).to eq(
        Api::V3::Node.where(
          node_type_id: api_v3_municipality_node.id
        ).pluck(:id)
      )
    end
  end
end
