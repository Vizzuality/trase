shared_context 'api v3 node types' do
  let(:api_v3_biome_node_type) do
    FactoryGirl.create(:api_v3_node_type, name: NodeTypeName::BIOME)
  end
  let(:api_v3_state_node_type) do
    FactoryGirl.create(:api_v3_node_type, name: NodeTypeName::STATE)
  end
  let(:api_v3_logistics_hub_node_type) do
    FactoryGirl.create(:api_v3_node_type, name: NodeTypeName::LOGISTICS_HUB)
  end
  let(:api_v3_municipality_node_type) do
    FactoryGirl.create(:api_v3_node_type, name: NodeTypeName::MUNICIPALITY)
  end
  let(:api_v3_exporter_node_type) do
    FactoryGirl.create(:api_v3_node_type, name: NodeTypeName::EXPORTER)
  end
  let(:api_v3_port_node_type) do
    FactoryGirl.create(:api_v3_node_type, name: NodeTypeName::PORT)
  end
  let(:api_v3_importer_node_type) do
    FactoryGirl.create(:api_v3_node_type, name: NodeTypeName::IMPORTER)
  end
  let(:api_v3_country_node_type) do
    FactoryGirl.create(:api_v3_node_type, name: NodeTypeName::COUNTRY)
  end
end
