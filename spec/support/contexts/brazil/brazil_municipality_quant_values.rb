shared_context 'brazil municipality quant values' do
  include_context 'quants'
  include_context 'brazil soy nodes'

  let!(:area_value) do
    NodeQuant.where(
      node_id: municipality_node.id, quant_id: area.id, year: nil
    ).first ||
      FactoryBot.create(:node_quant, node: municipality_node, quant: area, value: 24_577.1)
  end
  let!(:land_conflicts_value) do
    NodeQuant.where(
      node_id: municipality_node.id, quant_id: land_conflicts.id, year: 2015
    ).first ||
      FactoryBot.create(:node_quant, node: municipality_node, quant: land_conflicts, value: 0, year: 2015)
  end
  let!(:force_labour_value) do
    NodeQuant.where(
      node_id: municipality_node.id, quant_id: force_labour.id, year: 2010
    ).first ||
      FactoryBot.create(:node_quant, node: municipality_node, quant: force_labour, value: 0, year: 2010)
  end
  let!(:embargoes_value) do
    NodeQuant.where(
      node_id: municipality_node.id, quant_id: embargoes.id, year: 2015
    ).first ||
      FactoryBot.create(:node_quant, node: municipality_node, quant: embargoes, value: 31, year: 2015)
  end
  let!(:deforestation_v2_value) do
    NodeQuant.where(
      node_id: municipality_node.id, quant_id: deforestation_v2.id, year: 2015
    ).first ||
      FactoryBot.create(:node_quant, node: municipality_node, quant: deforestation_v2, value: 0, year: 2015)
  end
  let!(:population_value) do
    NodeQuant.where(
      node_id: municipality_node.id, quant_id: population.id, year: 2015
    ).first ||
      FactoryBot.create(:node_quant, node: municipality_node, quant: population, value: 1_118_400, year: 2015)
  end
  let!(:soy_tn_value) do
    NodeQuant.where(
      node_id: municipality_node.id, quant_id: soy_tn.id, year: 2015
    ).first ||
      FactoryBot.create(:node_quant, node: municipality_node, quant: soy_tn, value: 100_204, year: 2015)
  end
end
