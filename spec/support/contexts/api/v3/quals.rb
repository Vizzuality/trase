shared_context 'api v3 quals' do
  let(:api_v3_state) do
    FactoryGirl.create(
      :api_v3_qual,
      name: 'STATE',
      display_name: 'State'
    )
  end
  let(:api_v3_biome) do
    FactoryGirl.create(
      :api_v3_qual,
      name: 'BIOME',
      display_name: 'Biome'
    )
  end
  let(:api_v3_zero_deforestation) do
    FactoryGirl.create(
      :api_v3_qual,
      name: 'ZERO_DEFORESTATION',
      display_name: 'Zero deforestation commitment (exporters)'
    )
  end
  let(:api_v3_zero_deforestation_link) do
    FactoryGirl.create(
      :api_v3_qual,
      name: 'ZERO_DEFORESTATION_LINK'
    )
  end
  let(:api_v3_supply_change) do
    FactoryGirl.create(
      :api_v3_qual,
      name: 'SUPPLY_CHANGE'
    )
  end
  let(:api_v3_supply_change_link) do
    FactoryGirl.create(
      :api_v3_qual,
      name: 'SUPPLY_CHANGE_LINK'
    )
  end
  let(:api_v3_rtrs_member) do
    FactoryGirl.create(
      name: 'RTRS_MEMBER'
    )
  end
end
