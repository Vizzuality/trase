require 'rails_helper'

RSpec.describe Api::V3::Dashboards::FilterSources do
  include_context 'api v3 brazil flows'
  include_context 'api v3 brazil soy goias flows'
  include_context 'api v3 paraguay flows'

  before(:each) do
    Api::V3::Readonly::FlowNode.refresh(
      sync: true, skip_dependencies: true, skip_dependents: true
    )
    Api::V3::Readonly::Dashboards::Source.refresh(sync: true)
  end

  describe :call do
    context 'when self ids match selected node type' do
      let(:filter) {
        Api::V3::Dashboards::FilterSources.new(
          node_types_ids: [api_v3_biome_node_type.id],
          sources_ids: [api_v3_biome_node.id]
        )
      }
      it 'filters by self id' do
        nodes = filter.call
        expect(nodes.first.name).to eq(api_v3_biome_node.name)
      end
    end
    context "when self ids don't match selected node type" do
      let(:filter) {
        Api::V3::Dashboards::FilterSources.new(
          node_types_ids: [api_v3_municipality_node_type.id],
          sources_ids: [api_v3_biome_node.id]
        )
      }
      it 'filters by node id' do
        nodes = filter.call
        expect(nodes.first.name).to eq(api_v3_municipality_abadia_de_goias.name)
      end
    end
  end

  describe :call_with_query_term do
    let(:filter) { Api::V3::Dashboards::FilterSources.new({}) }

    it 'exact match is on top' do
      nodes = filter.call_with_query_term('GOIAS')
      expect(nodes.first.name).to eq(api_v3_municipality_goias.name)
    end
  end
end
