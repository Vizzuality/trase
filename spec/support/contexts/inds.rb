shared_context 'inds' do
  let!(:forest_500) {
    FactoryGirl.create(:ind, actor_factsheet: true, place_factsheet: true, place_factsheet_temporal: false, name: 'FOREST_500', frontend_name: 'Forest 500 score', unit: 'Unitless')
  }

  let!(:water_scarcity) {
    FactoryGirl.create(:ind, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'WATER_SCARCITY', frontend_name: 'Water scarcity', unit: '/7')
  }

  let!(:human_development_index) {
    FactoryGirl.create(:ind, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'HDI', frontend_name: 'Human development index', unit: '/1')
  }

  let!(:gdp_per_capita) {
    FactoryGirl.create(:ind, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: true, name: 'GDP_CAP', frontend_name: 'GDP per capita', unit: 'BRL')
  }

  let!(:gdp_from_agriculture) {
    FactoryGirl.create(:ind, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: true, name: 'PERC_FARM_GDP_', frontend_name: 'GDP from agriculture', unit: '%')
  }

  let!(:smallholder_dominance) {
    FactoryGirl.create(:ind, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'SMALLHOLDERS', frontend_name: 'Smallholder dominance', unit: '%')
  }

  let!(:soy_areaperc) {
    FactoryGirl.create(:ind, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: true, name: 'SOY_AREAPERC', frontend_name: 'Agricultural land used for soy', unit: '%')
  }

  let!(:soy_yield) {
    FactoryGirl.create(:ind, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: true, name: 'SOY_YIELD', frontend_name: 'Soy yield', unit: 'Tn/ha')
  }
end
