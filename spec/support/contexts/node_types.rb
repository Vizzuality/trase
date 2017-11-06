shared_context 'node types' do
  let(:biome_node_type) do
    FactoryGirl.create(:node_type, node_type: NodeTypeName::BIOME)
  end
  let(:state_node_type) do
    FactoryGirl.create(:node_type, node_type: NodeTypeName::STATE)
  end
  let(:logistics_hub_node_type) do
    FactoryGirl.create(:node_type, node_type: NodeTypeName::LOGISTICS_HUB)
  end
  let(:municipality_node_type) do
    FactoryGirl.create(:node_type, node_type: NodeTypeName::MUNICIPALITY)
  end
  let(:exporter_node_type) do
    FactoryGirl.create(:node_type, node_type: NodeTypeName::EXPORTER)
  end
  let(:port_node_type) do
    FactoryGirl.create(:node_type, node_type: NodeTypeName::PORT)
  end
  let(:importer_node_type) do
    FactoryGirl.create(:node_type, node_type: NodeTypeName::IMPORTER)
  end
  let(:country_node_type) do
    FactoryGirl.create(:node_type, node_type: NodeTypeName::COUNTRY)
  end
end
