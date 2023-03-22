shared_context "api v3 brazil soy flow quants" do
  include_context "api v3 brazil soy flows"
  include_context "api v3 quants"

  let!(:api_v3_brazil_soy_flow1_volume) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_brazil_soy_flow1,
      quant: api_v3_volume,
      value: 10
    )
  end
  let!(:api_v3_brazil_soy_flow2_volume) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_brazil_soy_flow2,
      quant: api_v3_volume,
      value: 15
    )
  end
  let!(:api_v3_brazil_soy_flow3_volume) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_brazil_soy_flow3,
      quant: api_v3_volume,
      value: 20
    )
  end
  let!(:api_v3_brazil_soy_flow4_volume) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_brazil_soy_flow4,
      quant: api_v3_volume,
      value: 25
    )
  end
  let!(:api_v3_brazil_soy_flow5_volume) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_brazil_soy_flow5,
      quant: api_v3_volume,
      value: 30
    )
  end
  let!(:api_v3_brazil_soy_flow6_volume) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_brazil_soy_flow6,
      quant: api_v3_volume,
      value: 0
    )
  end
  let!(:api_v3_brazil_soy_flow1_deforestation_v2) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_brazil_soy_flow1,
      quant: api_v3_deforestation_v2,
      value: 20
    )
  end
  let!(:api_v3_brazil_soy_flow2_deforestation_v2) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_brazil_soy_flow2,
      quant: api_v3_deforestation_v2,
      value: 25
    )
  end
  let!(:api_v3_brazil_soy_flow1_potential_soy_deforestation_v2) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_brazil_soy_flow1,
      quant: api_v3_potential_soy_deforestation_v2,
      value: 30
    )
  end
  let!(:api_v3_brazil_soy_flow2_potential_soy_deforestation_v2) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_brazil_soy_flow2,
      quant: api_v3_potential_soy_deforestation_v2,
      value: 35
    )
  end
  let!(:api_v3_brazil_soy_flow1_agrosatelite_soy_defor_) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_brazil_soy_flow1,
      quant: api_v3_agrosatelite_soy_defor_,
      value: 40
    )
  end
  let!(:api_v3_brazil_soy_flow2_agrosatelite_soy_defor_) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_brazil_soy_flow2,
      quant: api_v3_agrosatelite_soy_defor_,
      value: 45
    )
  end
  let!(:api_v3_brazil_soy_flow1_land_use) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_brazil_soy_flow1,
      quant: api_v3_land_use,
      value: 50
    )
  end
  let!(:api_v3_brazil_soy_flow2_land_use) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_brazil_soy_flow2,
      quant: api_v3_land_use,
      value: 55
    )
  end
  let!(:api_v3_brazil_soy_flow1_biodiversity) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_brazil_soy_flow1,
      quant: api_v3_biodiversity,
      value: 60
    )
  end
  let!(:api_v3_brazil_soy_flow2_biodiversity) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_brazil_soy_flow2,
      quant: api_v3_biodiversity,
      value: 65
    )
  end
  let!(:api_v3_brazil_soy_flow1_ghg_) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_brazil_soy_flow1,
      quant: api_v3_ghg_,
      value: 70
    )
  end
  let!(:api_v3_brazil_soy_flow2_ghg_) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_brazil_soy_flow2,
      quant: api_v3_ghg_,
      value: 75
    )
  end
end
