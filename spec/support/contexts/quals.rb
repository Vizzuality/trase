shared_context 'quals' do
  let(:state) do
    FactoryGirl.create(:qual, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'STATE', frontend_name: 'State')
  end
  let(:biome) do
    FactoryGirl.create(:qual, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'BIOME', frontend_name: 'Biome')
  end
  let(:zero_deforestation) do
    FactoryGirl.create(:qual, actor_factsheet: true, place_factsheet: false, place_factsheet_temporal: false, name: 'ZERO_DEFORESTATION', frontend_name: 'Zero deforestation commitment (exporters)')
  end
  let(:zero_deforestation_link) do
    FactoryGirl.create(:qual, actor_factsheet: true, place_factsheet: false, place_factsheet_temporal: false, name: 'ZERO_DEFORESTATION_LINK')
  end
  let(:supply_change) do
    FactoryGirl.create(:qual, actor_factsheet: true, place_factsheet: false, place_factsheet_temporal: false, name: 'SUPPLY_CHANGE')
  end
  let(:supply_change_link) do
    FactoryGirl.create(:qual, actor_factsheet: true, place_factsheet: false, place_factsheet_temporal: false, name: 'SUPPLY_CHANGE_LINK')
  end
  let(:rtrs_member) do
    FactoryGirl.create(:qual, actor_factsheet: true, place_factsheet: false, place_factsheet_temporal: false, name: 'RTRS_MEMBER')
  end
end
