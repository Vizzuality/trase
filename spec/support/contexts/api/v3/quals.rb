shared_context 'api v3 quals' do
  let(:api_v3_state) {
    FactoryGirl.create(:api_v3_qual, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'STATE', frontend_name: 'State')
  }
  let(:api_v3_biome) {
    FactoryGirl.create(:api_v3_qual, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'BIOME', frontend_name: 'Biome')
  }
  let(:api_v3_zero_deforestation) {
    FactoryGirl.create(:api_v3_qual, actor_factsheet: true, place_factsheet: false, place_factsheet_temporal: false, name: 'ZERO_DEFORESTATION', frontend_name: 'Zero deforestation commitment (exporters)')
  }
  let(:api_v3_zero_deforestation_link) {
    FactoryGirl.create(:api_v3_qual, actor_factsheet: true, place_factsheet: false, place_factsheet_temporal: false, name: 'ZERO_DEFORESTATION_LINK')
  }
  let(:api_v3_supply_change) {
    FactoryGirl.create(:api_v3_qual, actor_factsheet: true, place_factsheet: false, place_factsheet_temporal: false, name: 'SUPPLY_CHANGE')
  }
  let(:api_v3_supply_change_link) {
    FactoryGirl.create(:api_v3_qual, actor_factsheet: true, place_factsheet: false, place_factsheet_temporal: false, name: 'SUPPLY_CHANGE_LINK')
  }
  let(:api_v3_rtrs_member) {
    FactoryGirl.create(:api_v3_qual, actor_factsheet: true, place_factsheet: false, place_factsheet_temporal: false, name: 'RTRS_MEMBER')
  }
end
