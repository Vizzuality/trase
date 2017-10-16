shared_context 'quals' do
  let(:state) {
    FactoryGirl.create(:qual, place_factsheet: true, place_factsheet_temporal: false, name: 'STATE', frontend_name: 'State')
  }

  let(:biome) {
    FactoryGirl.create(:qual, place_factsheet: true, place_factsheet_temporal: false, name: 'BIOME', frontend_name: 'Biome')
  }

  let(:deforestation_v2){
    FactoryGirl.create(:qual, name: 'DEFORESTATION_V2', frontend_name: 'Deforestation V2')
  }

  let(:zero_deforestation){
    FactoryGirl.create(:qual, name: 'ZERO_DEFORESTATION', frontend_name: 'Zero deforestation')
  }
end
