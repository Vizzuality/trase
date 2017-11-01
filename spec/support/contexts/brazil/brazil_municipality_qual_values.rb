shared_context 'brazil municipality qual values' do
  include_context 'quals'
  include_context 'brazil soy nodes'

  let!(:state_value) do
    FactoryGirl.create(:node_qual, node: municipality_node, qual: state, value: 'MATO GROSSO')
  end
  let!(:biome_value) do
    FactoryGirl.create(:node_qual, node: municipality_node, qual: biome, value: 'AMAZONIA')
  end
  let!(:embargoes_value) do
    FactoryGirl.create(:node_qual, node: municipality_node, qual: zero_deforestation, value: 'Yes')
  end
  let!(:embargoes_value) do
    FactoryGirl.create(:node_qual, node: municipality_node, qual: zero_deforestation, value: 'Yes')
  end
end
