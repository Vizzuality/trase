shared_context 'api v3 indonesia node types' do
  include_context 'api v3 node types'

  let(:api_v3_kabupaten_node_type) do
    Api::V3::NodeType.find_by_name('KABUPATEN') ||
      FactoryBot.create(:api_v3_node_type, name: 'KABUPATEN')
  end

  let(:api_v3_mill_node_type) do
    Api::V3::NodeType.find_by_name('MILL') ||
      FactoryBot.create(:api_v3_node_type, name: 'MILL')
  end
end