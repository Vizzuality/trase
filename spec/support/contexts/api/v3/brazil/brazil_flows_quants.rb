shared_context 'api v3 brazil flows quants' do
  include_context 'api v3 brazil flows'
  include_context 'api v3 quants'

  let!(:flow1_volume) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_flow1,
      quant: api_v3_volume,
      value: 10
    )
  end
  let!(:flow2_volume) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_flow2,
      quant: api_v3_volume,
      value: 15
    )
  end
  let!(:flow3_volume) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_flow3,
      quant: api_v3_volume,
      value: 20
    )
  end
  let!(:flow4_volume) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_flow4,
      quant: api_v3_volume,
      value: 25
    )
  end
  let!(:flow5_volume) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_flow5,
      quant: api_v3_volume,
      value: 30
    )
  end
  let!(:flow6_volume) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_flow6,
      quant: api_v3_volume,
      value: 0
    )
  end
  let!(:flow1_deforestation_v2) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_flow1,
      quant: api_v3_deforestation_v2,
      value: 20
    )
  end
  let!(:flow2_deforestation_v2) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_flow2,
      quant: api_v3_deforestation_v2,
      value: 25
    )
  end
  let!(:flow1_potential_soy_deforestation_v2) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_flow1,
      quant: api_v3_potential_soy_deforestation_v2,
      value: 30
    )
  end
  let!(:flow2_potential_soy_deforestation_v2) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_flow2,
      quant: api_v3_potential_soy_deforestation_v2,
      value: 35
    )
  end
  let!(:flow1_agrosatelite_soy_defor_) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_flow1,
      quant: api_v3_agrosatelite_soy_defor_,
      value: 40
    )
  end
  let!(:flow2_agrosatelite_soy_defor_) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_flow2,
      quant: api_v3_agrosatelite_soy_defor_,
      value: 45
    )
  end
  let!(:flow1_land_use) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_flow1,
      quant: api_v3_land_use,
      value: 50
    )
  end
  let!(:flow2_land_use) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_flow2,
      quant: api_v3_land_use,
      value: 55
    )
  end
  let!(:flow1_biodiversity) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_flow1,
      quant: api_v3_biodiversity,
      value: 60
    )
  end
  let!(:flow2_biodiversity) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_flow2,
      quant: api_v3_biodiversity,
      value: 65
    )
  end
  let!(:flow1_ghg_) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_flow1,
      quant: api_v3_ghg_,
      value: 70
    )
  end
  let!(:flow2_ghg_) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_flow2,
      quant: api_v3_ghg_,
      value: 75
    )
  end
end
