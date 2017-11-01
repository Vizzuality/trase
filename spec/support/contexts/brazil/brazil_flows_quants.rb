shared_context 'brazil flows quants' do
  include_context 'brazil flows'
  include_context 'quants'

  let!(:flow1_volume) do
    FactoryGirl.create(:flow_quant, flow: flow1, quant: volume, value: 10)
  end
  let!(:flow1_volume) do
    FactoryGirl.create(:flow_quant, flow: flow2, quant: volume, value: 15)
  end
  let!(:flow1_deforestation_v2) do
    FactoryGirl.create(:flow_quant, flow: flow1, quant: deforestation_v2, value: 20)
  end
  let!(:flow2_deforestation_v2) do
    FactoryGirl.create(:flow_quant, flow: flow1, quant: deforestation_v2, value: 25)
  end
  let!(:flow1_potential_soy_deforestation_v2) do
    FactoryGirl.create(:flow_quant, flow: flow1, quant: potential_soy_deforestation_v2, value: 30)
  end
  let!(:flow2_potential_soy_deforestation_v2) do
    FactoryGirl.create(:flow_quant, flow: flow1, quant: potential_soy_deforestation_v2, value: 35)
  end
  let!(:flow1_agrosatelite_soy_defor_) do
    FactoryGirl.create(:flow_quant, flow: flow1, quant: agrosatelite_soy_defor_, value: 40)
  end
  let!(:flow2_agrosatelite_soy_defor_) do
    FactoryGirl.create(:flow_quant, flow: flow1, quant: agrosatelite_soy_defor_, value: 45)
  end
  let!(:flow1_land_use) do
    FactoryGirl.create(:flow_quant, flow: flow1, quant: land_use, value: 50)
  end
  let!(:flow2_land_use) do
    FactoryGirl.create(:flow_quant, flow: flow1, quant: land_use, value: 55)
  end
  let!(:flow1_biodiversity) do
    FactoryGirl.create(:flow_quant, flow: flow1, quant: biodiversity, value: 60)
  end
  let!(:flow2_biodiversity) do
    FactoryGirl.create(:flow_quant, flow: flow1, quant: biodiversity, value: 65)
  end
  let!(:flow1_ghg_) do
    FactoryGirl.create(:flow_quant, flow: flow1, quant: ghg_, value: 70)
  end
  let!(:flow2_ghg_) do
    FactoryGirl.create(:flow_quant, flow: flow1, quant: ghg_, value: 75)
  end
end
