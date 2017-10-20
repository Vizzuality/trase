shared_context 'brazil municipality quant values' do
  include_context 'quants'
  include_context 'brazil soy nodes'

  let!(:area_value) {
    FactoryGirl.create(:node_quant, node: municipality_node, quant: area, value: 24577.1)
  }
  let!(:land_conflicts_value) {
    FactoryGirl.create(:node_quant, node: municipality_node, quant: land_conflicts, value: 0)
  }
  let!(:force_labour_value) {
    FactoryGirl.create(:node_quant, node: municipality_node, quant: force_labour, value: 0)
  }
  let!(:embargoes_value) {
    FactoryGirl.create(:node_quant, node: municipality_node, quant: embargoes, value: 0)
  }
  # let!(:fob_value) {
  #   FactoryGirl.create(:node_quant, node: municipality_node, quant: fob, value: 0)
  # }
  let!(:deforestation_v2_value) {
    FactoryGirl.create(:node_quant, node: municipality_node, quant: deforestation_v2, value: 0, year: 2015)
  }
  let!(:population_value) {
    FactoryGirl.create(:node_quant, node: municipality_node, quant: population, value: 1118400, year: 2015)
  }
  let!(:soy_tn_value) {
    FactoryGirl.create(:node_quant, node: municipality_node, quant: soy_tn, value: 100204, year: 2015)
  }
end
