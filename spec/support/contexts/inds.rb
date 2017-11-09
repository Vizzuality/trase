shared_context 'inds' do
  let!(:forest_500) do
    Ind.find_by_name('FOREST_500') ||
      FactoryGirl.create(:ind, actor_factsheet: true, place_factsheet: true, place_factsheet_temporal: false, name: 'FOREST_500', frontend_name: 'Forest 500 score', unit: 'Unitless')
  end

  let!(:water_scarcity) do
    Ind.find_by_name('WATER_SCARCITY') ||
      FactoryGirl.create(:ind, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'WATER_SCARCITY', frontend_name: 'Water scarcity', unit: '/7')
  end

  let!(:human_development_index) do
    Ind.find_by_name('HDI') ||
      FactoryGirl.create(:ind, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'HDI', frontend_name: 'Human development index', unit: '/1')
  end

  let!(:gdp_per_capita) do
    Ind.find_by_name('GDP_CAP') ||
      FactoryGirl.create(:ind, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: true, name: 'GDP_CAP', frontend_name: 'GDP per capita', unit: 'BRL')
  end

  let!(:gdp_from_agriculture) do
    Ind.find_by_name('PERC_FARM_GDP_') ||
      FactoryGirl.create(:ind, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: true, name: 'PERC_FARM_GDP_', frontend_name: 'GDP from agriculture', unit: '%')
  end

  let!(:smallholder_dominance) do
    Ind.find_by_name('SMALLHOLDERS') ||
      FactoryGirl.create(:ind, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: false, name: 'SMALLHOLDERS', frontend_name: 'Smallholder dominance', unit: '%')
  end

  let!(:soy_areaperc) do
    Ind.find_by_name('SOY_AREAPERC') ||
      FactoryGirl.create(:ind, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: true, name: 'SOY_AREAPERC', frontend_name: 'Agricultural land used for soy', unit: '%')
  end

  let!(:soy_yield) do
    Ind.find_by_name('SOY_YIELD') ||
      FactoryGirl.create(:ind, actor_factsheet: false, place_factsheet: true, place_factsheet_temporal: true, name: 'SOY_YIELD', frontend_name: 'Soy yield', unit: 'Tn/ha')
  end
end
