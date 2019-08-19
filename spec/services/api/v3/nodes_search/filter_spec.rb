require 'rails_helper'

RSpec.describe Api::V3::NodesSearch::Filter do
  include_context 'api v3 brazil flows'
  include_context 'api v3 paraguay flows'
  include_context 'api v3 brazil soy goias flows'
  include_context 'api v3 brazil soy profiles'

  describe :call do
    before(:each) do
      Api::V3::Readonly::Node.refresh(sync: true)
    end
    let(:filter) { Api::V3::NodesSearch::Filter.new }

    it 'matches on any part of the name' do
      nodes = filter.call('par')
      expect(
        nodes.map(&:name)
      ).to include(api_v3_paraguay_department_node.name)
    end

    it 'matches in all contexts' do
      nodes = filter.call('c')
      expect(
        nodes.map(&:name)
      ).to match_array([
        api_v3_paraguay_exporter_node,
        api_v3_paraguay_biome_node,
        api_v3_logistics_hub_node
      ].map(&:name))
    end

    it 'filters by context id' do
      nodes = filter.call('c', api_v3_paraguay_context.id)
      expect(
        nodes.map(&:name)
      ).to match_array([
        api_v3_paraguay_exporter_node,
        api_v3_paraguay_biome_node
      ].map(&:name))
    end

    it 'filters by profile only' do
      nodes = filter.call('no', nil, true)
      expect(
        nodes.map(&:name)
      ).to include(api_v3_municipality_node.name)
    end

    it 'exact match is on top' do
      nodes = filter.call('GOIAS', nil, true)
      expect(nodes.first.name).to eq(api_v3_municipality_goias.name)
    end
  end
end
