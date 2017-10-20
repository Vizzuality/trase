shared_context 'brazil qual values' do
  include_context 'quals'
  include_context 'brazil soy nodes'

  let!(:state_value){
    FactoryGirl.create(:node_qual, node: municipality_node, qual: state, value: 'MATO GROSSO')
  }
  let!(:biome_value){
    FactoryGirl.create(:node_qual, node: municipality_node, qual: biome, value: 'AMAZONIA')
  }
  let!(:embargoes_value){
    FactoryGirl.create(:node_qual, node: municipality_node, qual: zero_deforestation, value: 'Yes')
  }
  let!(:embargoes_value){
    FactoryGirl.create(:node_qual, node: municipality_node, qual: zero_deforestation, value: 'Yes')
  }
end
