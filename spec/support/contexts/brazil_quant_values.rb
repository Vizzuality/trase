shared_context 'brazil quant values' do
  include_context 'quants'
  include_context 'brazil soy nodes'
  let!(:area_value){
    FactoryGirl.create(:node_quant, node: municipality, quant: area, value: 24577.1)
  }
  let!(:land_conflicts_value){
    FactoryGirl.create(:node_quant, node: municipality, quant: land_conflicts, value: 0)
  }
  let!(:force_labour_value){
    FactoryGirl.create(:node_quant, node: municipality, quant: force_labour, value: 0)
  }
  let!(:embargoes_value){
    FactoryGirl.create(:node_quant, node: municipality, quant: embargoes, value: 0)
  }
end
