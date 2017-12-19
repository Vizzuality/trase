shared_context 'api v3 brazil municipality quant values' do
  include_context 'api v3 quants'
  include_context 'api v3 brazil soy nodes'

  let!(:api_v3_area_value) do
    FactoryBot.create(
      :api_v3_node_quant,
      node: api_v3_municipality_node,
      quant: api_v3_area,
      value: 24_577.1
    )
  end
  let!(:api_v3_land_conflicts_value) do
    FactoryBot.create(
      :api_v3_node_quant,
      node: api_v3_municipality_node,
      quant: api_v3_land_conflicts,
      value: 0,
      year: 2015
    )
  end
  let!(:api_v3_force_labour_value) do
    FactoryBot.create(
      :api_v3_node_quant,
      node: api_v3_municipality_node,
      quant: api_v3_force_labour,
      value: 0,
      year: 2010
    )
  end
  let!(:api_v3_embargoes_value) do
    FactoryBot.create(
      :api_v3_node_quant,
      node: api_v3_municipality_node,
      quant: api_v3_embargoes,
      value: 31,
      year: 2015
    )
  end
  let!(:api_v3_deforestation_v2_value) do
    FactoryBot.create(
      :api_v3_node_quant,
      node: api_v3_municipality_node,
      quant: api_v3_deforestation_v2,
      value: 0,
      year: 2015
    )
  end
  let!(:api_v3_population_value) do
    FactoryBot.create(
      :api_v3_node_quant,
      node: api_v3_municipality_node,
      quant: api_v3_population,
      value: 1_118_400,
      year: 2015
    )
  end
  let!(:api_v3_soy_tn_value) do
    FactoryBot.create(
      :api_v3_node_quant,
      node: api_v3_municipality_node,
      quant: api_v3_soy_tn,
      value: 100_204,
      year: 2015
    )
  end
end
