shared_context 'api v3 brazil importer quant values' do
  include_context 'api v3 quants'
  include_context 'api v3 brazil soy nodes'

  let!(:api_v3_soy_tn_value) do
    FactoryBot.create(
      :api_v3_node_quant,
      node: api_v3_importer1_node,
      quant: api_v3_soy_tn,
      value: 100_204,
      year: 2015
    )
  end
  let!(:api_v3_potential_soy_deforestation_v2_value) do
    FactoryBot.create(
      :api_v3_node_quant,
      node: api_v3_importer1_node,
      quant: api_v3_potential_soy_deforestation_v2,
      value: 100_204,
      year: 2015
    )
  end
  let!(:api_v3_deforestation_v2_value) do
    FactoryBot.create(
      :api_v3_node_quant,
      node: api_v3_importer1_node,
      quant: api_v3_deforestation_v2,
      value: 100_204,
      year: 2015
    )
  end
  let!(:api_v3_agrosatelite_soy_defor__value) do
    FactoryBot.create(
      :api_v3_node_quant,
      node: api_v3_importer1_node,
      quant: api_v3_agrosatelite_soy_defor_,
      value: 100_204,
      year: 2015
    )
  end
  let!(:api_v3_volume_value) do
    FactoryBot.create(
      :api_v3_node_quant,
      node: api_v3_importer1_node,
      quant: api_v3_volume,
      value: 100_204,
      year: 2015
    )
  end
  let!(:api_v3_soy__value) do
    FactoryBot.create(
      :api_v3_node_quant,
      node: api_v3_importer1_node,
      quant: api_v3_soy_,
      value: 11_548_228.683897123,
      year: 2015
    )
  end
end
