shared_context 'quals' do
  let(:state) {
    FactoryGirl.create(:qual, place_factsheet: true, place_factsheet_temporal: false, name: 'STATE', frontend_name: 'State')
  }

  let(:biome) {
    FactoryGirl.create(:qual, place_factsheet: true, place_factsheet_temporal: false, name: 'BIOME', frontend_name: 'Biome')
  }

  let(:zero_deforestation){
    FactoryGirl.create(:qual, place_factsheet: false, place_factsheet_temporal: false, name: 'ZERO_DEFORESTATION', frontend_name: 'Zero deforestation commitment (exporters)')
  }
end
