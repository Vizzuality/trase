shared_context 'api v3 brazil municipality qual values' do
  include_context 'api v3 quals'
  include_context 'api v3 brazil soy nodes'

  let!(:api_v3_state_value) do
    FactoryBot.create(
      :api_v3_node_qual,
      node: api_v3_municipality_node,
      qual: api_v3_state,
      value: 'MATO GROSSO'
    )
  end
  let!(:api_v3_biome_value) do
    FactoryBot.create(
      :api_v3_node_qual,
      node: api_v3_municipality_node,
      qual: api_v3_biome,
      value: 'AMAZONIA'
    )
  end
  let!(:api_v3_embargoes_value) do
    FactoryBot.create(
      :api_v3_node_qual,
      node: api_v3_municipality_node,
      qual: api_v3_zero_deforestation,
      value: 'Yes'
    )
  end
  let!(:api_v3_embargoes_value) do
    FactoryBot.create(
      :api_v3_node_qual,
      node: api_v3_municipality_node,
      qual: api_v3_zero_deforestation,
      value: 'Yes'
    )
  end
end
