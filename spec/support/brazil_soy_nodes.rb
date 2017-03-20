shared_context "brazil soy nodes" do
  let(:biome){
    FactoryGirl.create(:biome_node, name: 'AMAZONIA')
  }
  let(:state){
    FactoryGirl.create(:state_node, name: 'MATO GROSSO')
  }
  let(:logistics_hub){
    FactoryGirl.create(:logistics_hub_node, name: 'CUIABA')
  }
  let(:municipality){
    FactoryGirl.create(:municipality_node, name: 'NOVA UBIRATA')
  }
  let(:exporter1){
    FactoryGirl.create(:exporter_node, name: 'AFG BRASIL')
  }
  let(:port1){
    FactoryGirl.create(:port_node, name: 'IMBITUBA')
  }
  let(:importer1){
    FactoryGirl.create(:importer_node, name: 'UNKNOWN CUSTOMER')
  }
  let(:country_of_destination1){
    FactoryGirl.create(:country_node, name: 'RUSSIAN FEDERATION')
  }
  let!(:biome_context_node){
    FactoryGirl.create(
      :context_node,
      context: context, node_type: biome.node_type, column_position: 0, column_group: 0
    )
  }
  let!(:state_context_node){
    FactoryGirl.create(
      :context_node,
      context: context, node_type: state.node_type, column_position: 1, column_group: 0
    )
  }
  let!(:logistics_hub_context_node){
    FactoryGirl.create(
      :context_node,
      context: context, node_type: logistics_hub.node_type, column_position: 2, column_group: 0
    )
  }
  let!(:municipality_context_node){
    FactoryGirl.create(
      :context_node,
      context: context, node_type: municipality.node_type, column_position: 3, column_group: 0
    )
  }
  let!(:exporter1_context_node){
    FactoryGirl.create(
      :context_node,
      context: context, node_type: exporter1.node_type, column_position: 4, column_group: 1
    )
  }
  let!(:port1_context_node){
    FactoryGirl.create(
      :context_node,
      context: context, node_type: port1.node_type, column_position: 5, column_group: 1
    )
  }
  let!(:importer1_context_node){
    FactoryGirl.create(
      :context_node,
      context: context, node_type: importer1.node_type, column_position: 6, column_group: 2
    )
  }
  let!(:country_of_destination1_context_node){
    FactoryGirl.create(
      :context_node,
      context: context, node_type: country_of_destination1.node_type, column_position: 7, column_group: 3
    )
  }
end
