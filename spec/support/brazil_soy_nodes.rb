shared_context "brazil soy nodes" do
  include_context "node types"

  let(:biome){
    FactoryGirl.create(:node, name: 'AMAZONIA', node_type: biome_node_type)
  }
  let(:state){
    FactoryGirl.create(:node, name: 'MATO GROSSO', node_type: state_node_type)
  }
  let(:logistics_hub){
    FactoryGirl.create(:node, name: 'CUIABA', node_type: logistics_hub_node_type)
  }
  let(:municipality){
    FactoryGirl.create(:node, name: 'NOVA UBIRATA', node_type: municipality_node_type)
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
