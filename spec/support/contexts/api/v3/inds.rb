shared_context 'api v3 inds' do
  let!(:api_v3_forest_500) do
    i = Api::V3::Ind.find_by_name('FOREST_500')
    unless i
      i = FactoryBot.create(
        :api_v3_ind,
        name: 'FOREST_500',
        unit: 'Unitless'
      )
      FactoryBot.create(
        :api_v3_ind_property,
        ind: i,
        display_name: 'Forest 500 score'
      )
    end
    i
  end

  let!(:api_v3_water_scarcity) do
    i = Api::V3::Ind.find_by_name('WATER_SCARCITY')
    unless i
      i = FactoryBot.create(
        :api_v3_ind,
        name: 'WATER_SCARCITY',
        unit: '/7'
      )
      FactoryBot.create(
        :api_v3_ind_property,
        ind: i,
        display_name: 'Water scarcity'
      )
    end
    i
  end

  let!(:api_v3_human_development_index) do
    i = Api::V3::Ind.find_by_name('HDI')
    unless i
      i = FactoryBot.create(
        :api_v3_ind,
        name: 'HDI',
        unit: '/1'
      )
      FactoryBot.create(
        :api_v3_ind_property,
        ind: i,
        display_name: 'Human development index'
      )
    end
    i
  end

  let!(:api_v3_gdp_per_capita) do
    i = Api::V3::Ind.find_by_name('GDP_CAP')
    unless i
      i = FactoryBot.create(
        :api_v3_ind,
        name: 'GDP_CAP',
        unit: 'BRL'
      )
      FactoryBot.create(
        :api_v3_ind_property,
        ind: i,
        display_name: 'GDP per capita'
      )
    end
    i
  end

  let!(:api_v3_gdp_from_agriculture) do
    i = Api::V3::Ind.find_by_name('PERC_FARM_GDP_')
    unless i
      i = FactoryBot.create(
        :api_v3_ind,
        name: 'PERC_FARM_GDP_',
        unit: '%'
      )
      FactoryBot.create(
        :api_v3_ind_property,
        ind: i,
        display_name: 'GDP from agriculture'
      )
    end
    i
  end

  let!(:api_v3_smallholder_dominance) do
    i = Api::V3::Ind.find_by_name('SMALLHOLDERS')
    unless i
      i = FactoryBot.create(
        :api_v3_ind,
        name: 'SMALLHOLDERS',
        unit: '%'
      )
      FactoryBot.create(
        :api_v3_ind_property,
        ind: i,
        display_name: 'Smallholder dominance'
      )
    end
    i
  end

  let!(:api_v3_soy_areaperc) do
    i = Api::V3::Ind.find_by_name('SOY_AREAPERC')
    unless i
      i = FactoryBot.create(
        :api_v3_ind,
        name: 'SOY_AREAPERC',
        unit: '%'
      )
      FactoryBot.create(
        :api_v3_ind_property,
        ind: i,
        display_name: 'Agricultural land used for soy'
      )
    end
    i
  end

  let!(:api_v3_soy_yield) do
    i = Api::V3::Ind.find_by_name('SOY_YIELD')
    unless i
      i = FactoryBot.create(
        :api_v3_ind,
        name: 'SOY_YIELD',
        unit: 'Tn/ha'
      )
      FactoryBot.create(
        :api_v3_ind_property,
        ind: i,
        display_name: 'Soy yield'
      )
    end
    i
  end
end
