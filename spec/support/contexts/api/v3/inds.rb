shared_context 'api v3 inds' do
  let!(:api_v3_forest_500) {
    FactoryGirl.create(:api_v3_ind, name: 'FOREST_500', display_name: 'Forest 500 score', unit: 'Unitless')
  }

  let!(:api_v3_water_scarcity) {
    FactoryGirl.create(:api_v3_ind, name: 'WATER_SCARCITY', display_name: 'Water scarcity', unit: '/7')
  }

  let!(:api_v3_human_development_index) {
    FactoryGirl.create(:api_v3_ind, name: 'HDI', display_name: 'Human development index', unit: '/1')
  }

  let!(:api_v3_gdp_per_capita) {
    FactoryGirl.create(:api_v3_ind, name: 'GDP_CAP', display_name: 'GDP per capita', unit: 'BRL')
  }

  let!(:api_v3_gdp_from_agriculture) {
    FactoryGirl.create(:api_v3_ind, name: 'PERC_FARM_GDP_', display_name: 'GDP from agriculture', unit: '%')
  }

  let!(:api_v3_smallholder_dominance) {
    FactoryGirl.create(:api_v3_ind, name: 'SMALLHOLDERS', display_name: 'Smallholder dominance', unit: '%')
  }

  let!(:api_v3_soy_areaperc) {
    FactoryGirl.create(:api_v3_ind, name: 'SOY_AREAPERC', display_name: 'Agricultural land used for soy', unit: '%')
  }

  let!(:api_v3_soy_yield) {
    FactoryGirl.create(:api_v3_ind, name: 'SOY_YIELD', display_name: 'Soy yield', unit: 'Tn/ha')
  }
end
