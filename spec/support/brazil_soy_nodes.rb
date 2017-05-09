shared_context 'brazil soy nodes' do
  include_context 'node types'
  include_context 'brazil context nodes'
  let(:state){
    FactoryGirl.create(:node, name: 'MATO GROSSO', node_type: state_node_type)
  }
  let(:biome){
    FactoryGirl.create(:node, name: 'AMAZONIA', node_type: biome_node_type, parent: state)
  }
  let(:logistics_hub){
    FactoryGirl.create(:node, name: 'CUIABA', node_type: logistics_hub_node_type, parent: biome)
  }
  let(:municipality){
    FactoryGirl.create(:node, name: 'NOVA UBIRATA', node_type: municipality_node_type, parent: biome)
  }
  let(:exporter1){
    FactoryGirl.create(:node, name: 'AFG BRASIL', node_type: exporter_node_type)
  }
  let(:port1){
    FactoryGirl.create(:node, name: 'IMBITUBA', node_type: port_node_type)
  }
  let(:importer1){
    FactoryGirl.create(:node, name: 'UNKNOWN CUSTOMER', node_type: importer_node_type)
  }
  let(:country_of_destination1){
    FactoryGirl.create(:node, name: 'RUSSIAN FEDERATION', node_type: country_node_type)
  }
end
