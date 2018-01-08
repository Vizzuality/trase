shared_context 'brazil soy nodes' do
  include_context 'node types'
  include_context 'quals'
  include_context 'brazil context nodes'

  let!(:state_node) do
    Node.find_by_name('MATO GROSSO') ||
      FactoryBot.create(:node, name: 'MATO GROSSO', node_type: state_node_type, geo_id: 'BR51')
  end
  let!(:biome_node) do
    Node.find_by_name('AMAZONIA') ||
      FactoryBot.create(:node, name: 'AMAZONIA', node_type: biome_node_type, geo_id: 'BR1')
  end
  let!(:logistics_hub_node) do
    Node.find_by_name('CUIABA') ||
      FactoryBot.create(:node, name: 'CUIABA', node_type: logistics_hub_node_type)
  end
  let!(:municipality_node) do
    Node.find_by_name('NOVA UBIRATA') ||
      FactoryBot.create(:node, name: 'NOVA UBIRATA', node_type: municipality_node_type, geo_id: 'BR5106240')
  end
  let!(:exporter1_node) do
    Node.find_by_name('AFG BRASIL') ||
      FactoryBot.create(:node, name: 'AFG BRASIL', node_type: exporter_node_type)
  end
  let!(:port1_node) do
    Node.find_by_name('IMBITUBA') ||
      FactoryBot.create(:node, name: 'IMBITUBA', node_type: port_node_type)
  end
  let!(:importer1_node) do
    Node.find_by_name('UNKNOWN CUSTOMER') ||
      FactoryBot.create(:node, name: 'UNKNOWN CUSTOMER', node_type: importer_node_type)
  end
  let!(:country_of_destination1_node) do
    Node.find_by_name('RUSSIAN FEDERATION') ||
      FactoryBot.create(:node, name: 'RUSSIAN FEDERATION', node_type: country_node_type, geo_id: 'CN')
  end
end
