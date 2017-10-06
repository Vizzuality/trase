shared_context 'inds' do
  let(:forest_500_ind) {
    FactoryGirl.create(:ind, place_factsheet: true, place_factsheet_temporal: false, name: 'FOREST_500', frontend_name: 'Forest 500 score ')
  }

  let(:water_scarcity_ind) {
    FactoryGirl.create(:ind, place_factsheet: true, place_factsheet_temporal: false, name: 'WATER_SCARCITY', frontend_name: 'Water scarcity')
  }
end
