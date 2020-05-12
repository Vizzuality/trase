require 'rails_helper'

RSpec.describe Api::V3::Contexts::Filter do
  include_context 'api v3 brazil context node types'
  include_context 'api v3 brazil recolor by attributes'
  include_context 'api v3 brazil resize by attributes'

  before(:each) do
    Api::V3::Readonly::FlowQualDistinctValues.refresh(sync: true, skip_dependents: true)
  end

  context 'when context without required context node types' do
    let(:incomplete_context) {
      c = FactoryBot.create(:api_v3_context)
      FactoryBot.create(:api_v3_context_property, context: c)
      c
    }
    let(:biome_context_node_type) {
      FactoryBot.create(
        :api_v3_context_node_type,
        context: incomplete_context,
        node_type: api_v3_biome_node_type
      )
    }
    let(:result) { Api::V3::Contexts::Filter.new.call }
    it 'does not list incomplete contexts' do
      expect(result.pluck(:id)).not_to include(incomplete_context.id)
    end
  end
end
