shared_context 'brazil importer quant values' do
  include_context 'quants'
  include_context 'brazil soy nodes'

  let!(:soy_tn_value) {
    FactoryGirl.create(:node_quant, node: importer1_node, quant: soy_tn, value: 100204, year: 2015)
  }
  let!(:potential_soy_deforestation_v2_value) {
    FactoryGirl.create(:node_quant, node: importer1_node, quant: potential_soy_deforestation_v2, value: 100204, year: 2015)
  }
  let!(:deforestation_v2_value) {
    FactoryGirl.create(:node_quant, node: importer1_node, quant: deforestation_v2, value: 100204, year: 2015)
  }
  let!(:agrosatelite_soy_defor__value) {
    FactoryGirl.create(:node_quant, node: importer1_node, quant: agrosatelite_soy_defor_, value: 100204, year: 2015)
  }
  let!(:volume_value) {
    FactoryGirl.create(:node_quant, node: importer1_node, quant: volume, value: 100204, year: 2015)
  }
  let!(:soy__value) {
    FactoryGirl.create(:node_quant, node: importer1_node, quant: soy_, value: 11548228.683897123, year: 2015)
  }
end
