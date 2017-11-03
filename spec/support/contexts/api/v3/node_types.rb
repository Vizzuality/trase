shared_context 'api v3 node types' do
  let(:api_v3_biome_node_type){
    FactoryGirl.create(:api_v3_node_type, name: NodeTypeName::BIOME)
  }
  let(:api_v3_state_node_type){
    FactoryGirl.create(:api_v3_node_type, name: NodeTypeName::STATE)
  }
  let(:api_v3_logistics_hub_node_type){
    FactoryGirl.create(:api_v3_node_type, name: NodeTypeName::LOGISTICS_HUB)
  }
  let(:api_v3_municipality_node_type){
    FactoryGirl.create(:api_v3_node_type, name: NodeTypeName::MUNICIPALITY)
  }
  let(:api_v3_exporter_node_type){
    FactoryGirl.create(:api_v3_node_type, name: NodeTypeName::EXPORTER)
  }
  let(:api_v3_port_node_type){
    FactoryGirl.create(:api_v3_node_type, name: NodeTypeName::PORT)
  }
  let(:api_v3_importer_node_type){
    FactoryGirl.create(:api_v3_node_type, name: NodeTypeName::IMPORTER)
  }
  let(:api_v3_country_node_type){
    FactoryGirl.create(:api_v3_node_type, name: NodeTypeName::COUNTRY)
  }
end
