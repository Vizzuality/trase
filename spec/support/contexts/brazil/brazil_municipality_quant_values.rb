shared_context 'brazil municipality quant values' do
  include_context 'quants'
  include_context 'brazil soy nodes'

  let!(:area_value) do
    FactoryBot.create(:node_quant, node: municipality_node, quant: area, value: 24_577.1)
  end
  let!(:land_conflicts_value) do
    FactoryBot.create(:node_quant, node: municipality_node, quant: land_conflicts, value: 0, year: 2015)
  end
  let!(:force_labour_value) do
    FactoryBot.create(:node_quant, node: municipality_node, quant: force_labour, value: 0, year: 2010)
  end
  let!(:embargoes_value) do
    FactoryBot.create(:node_quant, node: municipality_node, quant: embargoes, value: 31, year: 2015)
  end
  let!(:deforestation_v2_value) do
    FactoryBot.create(:node_quant, node: municipality_node, quant: deforestation_v2, value: 0, year: 2015)
  end
  let!(:population_value) do
    FactoryBot.create(:node_quant, node: municipality_node, quant: population, value: 1_118_400, year: 2015)
  end
  let!(:soy_tn_value) do
    FactoryBot.create(:node_quant, node: municipality_node, quant: soy_tn, value: 100_204, year: 2015)
  end
end
