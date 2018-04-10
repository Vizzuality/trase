require 'rails_helper'

RSpec.describe Api::V3::NodesSearch::Filter do
  include_context 'api v3 brazil flows'
  include_context 'api v3 paraguay flows'

  describe :call do
    before(:each) do
      Api::V3::Readonly::Node.refresh
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
        api_v3_logistics_hub_node,
        api_v3_importer1_node
      ].map(&:name))
    end
  end
end
