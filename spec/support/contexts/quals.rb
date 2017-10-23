shared_context 'quals' do
  let(:state) {
    FactoryGirl.create(:qual, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'STATE', frontend_name: 'State')
  }
  let(:biome) {
    FactoryGirl.create(:qual, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'BIOME', frontend_name: 'Biome')
  }
  let(:zero_deforestation) {
    FactoryGirl.create(:qual, actor_factsheet: true, place_factsheet: false, place_factsheet_temporal: false, name: 'ZERO_DEFORESTATION', frontend_name: 'Zero deforestation commitment (exporters)')
  }
  let(:zero_deforestation_link) {
    FactoryGirl.create(:qual, actor_factsheet: true, place_factsheet: false, place_factsheet_temporal: false, name: 'ZERO_DEFORESTATION_LINK')
  }
  let(:supply_change) {
    FactoryGirl.create(:qual, actor_factsheet: true, place_factsheet: false, place_factsheet_temporal: false, name: 'SUPPLY_CHANGE')
  }
  let(:supply_change_link) {
    FactoryGirl.create(:qual, actor_factsheet: true, place_factsheet: false, place_factsheet_temporal: false, name: 'SUPPLY_CHANGE_LINK')
  }
  let(:rtrs_member) {
    FactoryGirl.create(:qual, actor_factsheet: true, place_factsheet: false, place_factsheet_temporal: false, name: 'RTRS_MEMBER')
  }
end
