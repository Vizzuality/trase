require 'rails_helper'

RSpec.describe Api::V3::Nodes::Filter do
  include_context 'api v3 brazil flows quants'

  before(:each) do
    Api::V3::Readonly::SankeyNode.refresh(sync: true)
  end

  context 'when no params' do
    let(:result) { Api::V3::Nodes::Filter.new(api_v3_context).call }

    it 'returns all nodes' do
      expect(result.size).to eq(Api::V3::Node.count)
    end
  end
end
