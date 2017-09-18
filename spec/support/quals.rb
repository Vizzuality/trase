shared_context 'quals' do
  let(:state_qual) {
    FactoryGirl.create(:qual, place_factsheet: true, place_factsheet_temporal: false, name: 'STATE', frontend_name: 'State')
  }

  let(:biome_qual) {
    FactoryGirl.create(:qual, place_factsheet: true, place_factsheet_temporal: false, name: 'BIOME', frontend_name: 'Biome')
  }
end
