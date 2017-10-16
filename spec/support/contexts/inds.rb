shared_context 'inds' do
  let(:forest_500) {
    FactoryGirl.create(:ind, place_factsheet: true, place_factsheet_temporal: false, name: 'FOREST_500', frontend_name: 'Forest 500 score', unit: 'Unitless')
  }

  let(:water_scarcity) {
    FactoryGirl.create(:ind, place_factsheet: true, place_factsheet_temporal: false, name: 'WATER_SCARCITY', frontend_name: 'Water scarcity', unit: '/7')
  }
end
