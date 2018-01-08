shared_context 'brazil municipality qual values' do
  include_context 'quals'
  include_context 'brazil soy nodes'

  let!(:state_value) do
    NodeQual.where(node_id: municipality_node.id, qual_id: state.id, year: nil).first ||
      FactoryBot.create(:node_qual, node: municipality_node, qual: state, value: 'MATO GROSSO')
  end
  let!(:biome_value) do
    NodeQual.where(node_id: municipality_node.id, qual_id: biome.id, year: nil).first ||
      FactoryBot.create(:node_qual, node: municipality_node, qual: biome, value: 'AMAZONIA')
  end
  let!(:zero_deforestation_value) do
    NodeQual.where(node_id: municipality_node.id, qual_id: zero_deforestation.id, year: nil).first ||
      FactoryBot.create(:node_qual, node: municipality_node, qual: zero_deforestation, value: 'Yes')
  end
  let!(:zero_deforestation_link_value) do
    NodeQual.where(node_id: municipality_node.id, qual_id: zero_deforestation_link.id, year: nil).first ||
      FactoryBot.create(:node_qual, node: municipality_node, qual: zero_deforestation_link, value: 'http://')
  end
end
