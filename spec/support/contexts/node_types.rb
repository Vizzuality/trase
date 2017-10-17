shared_context 'node types' do
  let(:biome_node_type){
    FactoryGirl.create(:node_type, node_type:NodeTypeName::BIOME)
  }
  let(:state_node_type){
    FactoryGirl.create(:node_type, node_type:NodeTypeName::STATE)
  }
  let(:logistics_hub_node_type){
    FactoryGirl.create(:node_type, node_type:NodeTypeName::LOGISTICS_HUB)
  }
  let(:municipality_node_type){
    FactoryGirl.create(:node_type, node_type:NodeTypeName::MUNICIPALITY)
  }
  let(:exporter_node_type){
    FactoryGirl.create(:node_type, node_type:NodeTypeName::EXPORTER)
  }
  let(:port_node_type){
    FactoryGirl.create(:node_type, node_type:NodeTypeName::PORT)
  }
  let(:importer_node_type){
    FactoryGirl.create(:node_type, node_type:NodeTypeName::IMPORTER)
  }
  let(:country_node_type){
    FactoryGirl.create(:node_type, node_type:NodeTypeName::COUNTRY)
  }
end
