shared_context 'api v3 quals' do
  let(:api_v3_state) do
    FactoryGirl.create(:api_v3_qual, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'STATE', frontend_name: 'State')
  end
  let(:api_v3_biome) do
    FactoryGirl.create(:api_v3_qual, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'BIOME', frontend_name: 'Biome')
  end
  let(:api_v3_zero_deforestation) do
    FactoryGirl.create(:api_v3_qual, actor_factsheet: true, place_factsheet: false, place_factsheet_temporal: false, name: 'ZERO_DEFORESTATION', frontend_name: 'Zero deforestation commitment (exporters)')
  end
  let(:api_v3_zero_deforestation_link) do
    FactoryGirl.create(:api_v3_qual, actor_factsheet: true, place_factsheet: false, place_factsheet_temporal: false, name: 'ZERO_DEFORESTATION_LINK')
  end
  let(:api_v3_supply_change) do
    FactoryGirl.create(:api_v3_qual, actor_factsheet: true, place_factsheet: false, place_factsheet_temporal: false, name: 'SUPPLY_CHANGE')
  end
  let(:api_v3_supply_change_link) do
    FactoryGirl.create(:api_v3_qual, actor_factsheet: true, place_factsheet: false, place_factsheet_temporal: false, name: 'SUPPLY_CHANGE_LINK')
  end
  let(:api_v3_rtrs_member) do
    FactoryGirl.create(:api_v3_qual, actor_factsheet: true, place_factsheet: false, place_factsheet_temporal: false, name: 'RTRS_MEMBER')
  end
end
