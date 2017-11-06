shared_context 'brazil exporter quant values' do
  include_context 'quants'
  include_context 'brazil soy nodes'

  let!(:soy_tn_value) do
    FactoryGirl.create(:node_quant, node: exporter1_node, quant: soy_tn, value: 100_204, year: 2015)
  end
  let!(:potential_soy_deforestation_v2_value) do
    FactoryGirl.create(:node_quant, node: exporter1_node, quant: potential_soy_deforestation_v2, value: 100_204, year: 2015)
  end
  let!(:deforestation_v2_value) do
    FactoryGirl.create(:node_quant, node: exporter1_node, quant: deforestation_v2, value: 100_204, year: 2015)
  end
  let!(:agrosatelite_soy_defor__value) do
    FactoryGirl.create(:node_quant, node: exporter1_node, quant: agrosatelite_soy_defor_, value: 100_204, year: 2015)
  end
  let!(:volume_value) do
    FactoryGirl.create(:node_quant, node: exporter1_node, quant: volume, value: 100_204, year: 2015)
  end
  let!(:soy__value) do
    FactoryGirl.create(:node_quant, node: exporter1_node, quant: soy_, value: 11_548_228.683897123, year: 2015)
  end
end
