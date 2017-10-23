shared_context 'brazil flows quants' do
  include_context 'brazil flows'
  include_context 'quants'

  let!(:flow1_volume) {
    FactoryGirl.create(:flow_quant, flow: flow1, quant: volume, value: 10)
  }
  let!(:flow1_volume) {
    FactoryGirl.create(:flow_quant, flow: flow2, quant: volume, value: 15)
  }
  let!(:flow1_deforestation_v2) {
    FactoryGirl.create(:flow_quant, flow: flow1, quant: deforestation_v2, value: 20)
  }
  let!(:flow2_deforestation_v2) {
    FactoryGirl.create(:flow_quant, flow: flow1, quant: deforestation_v2, value: 25)
  }
  let!(:flow1_potential_soy_deforestation_v2) {
    FactoryGirl.create(:flow_quant, flow: flow1, quant: potential_soy_deforestation_v2, value: 30)
  }
  let!(:flow2_potential_soy_deforestation_v2) {
    FactoryGirl.create(:flow_quant, flow: flow1, quant: potential_soy_deforestation_v2, value: 35)
  }
  let!(:flow1_agrosatelite_soy_defor_) {
    FactoryGirl.create(:flow_quant, flow: flow1, quant: agrosatelite_soy_defor_, value: 40)
  }
  let!(:flow2_agrosatelite_soy_defor_) {
    FactoryGirl.create(:flow_quant, flow: flow1, quant: agrosatelite_soy_defor_, value: 45)
  }
  let!(:flow1_land_use) {
    FactoryGirl.create(:flow_quant, flow: flow1, quant: land_use, value: 50)
  }
  let!(:flow2_land_use) {
    FactoryGirl.create(:flow_quant, flow: flow1, quant: land_use, value: 55)
  }
  let!(:flow1_biodiversity) {
    FactoryGirl.create(:flow_quant, flow: flow1, quant: biodiversity, value: 60)
  }
  let!(:flow2_biodiversity) {
    FactoryGirl.create(:flow_quant, flow: flow1, quant: biodiversity, value: 65)
  }
  let!(:flow1_ghg_) {
    FactoryGirl.create(:flow_quant, flow: flow1, quant: ghg_, value: 70)
  }
  let!(:flow2_ghg_) {
    FactoryGirl.create(:flow_quant, flow: flow1, quant: ghg_, value: 75)
  }
end
