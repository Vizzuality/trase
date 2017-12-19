shared_context 'api v3 brazil recolor by' do
  include_context 'api v3 brazil contexts'
  include_context 'api v3 quals'
  include_context 'api v3 inds'

  let!(:recolor_by_attributes_forest_500) do
    FactoryBot.create(
      :api_v3_recolor_by_attribute,
      tooltip_text: 'forest 500 tooltip text',
      context: api_v3_context,
      position: 1,
      years: [],
      group_number: 1,
      is_disabled: false,
      is_default: false,
      legend_type: 'legend_type',
      legend_color_theme: 'legend_color_theme'
    )
  end
  let!(:recolor_by_inds_forest_500) do
    FactoryBot.create(
      :api_v3_recolor_by_ind,
      recolor_by_attribute: recolor_by_attributes_forest_500,
      ind: api_v3_forest_500
    )
  end

  let!(:recolor_by_attributes_water_scarcity) do
    FactoryBot.create(
      :api_v3_recolor_by_attribute,
      tooltip_text: 'water scarcity tooltip text',
      context: api_v3_context,
      position: 2,
      years: [],
      group_number: 1,
      is_disabled: false,
      is_default: false,
      legend_type: 'legend_type',
      legend_color_theme: 'legend_color_theme'
    )
  end
  let!(:recolor_by_inds_water_scarcity) do
    FactoryBot.create(
      :api_v3_recolor_by_ind,
      recolor_by_attribute: recolor_by_attributes_water_scarcity,
      ind: api_v3_water_scarcity
    )
  end

  let!(:recolor_by_attributes_biome) do
    FactoryBot.create(
      :api_v3_recolor_by_attribute,
      tooltip_text: 'biome tooltip text',
      context: api_v3_context,
      position: 3,
      years: [],
      group_number: 1,
      is_disabled: false,
      is_default: false,
      legend_type: 'legend_type',
      legend_color_theme: 'legend_color_theme'
    )
  end
  let!(:recolor_by_quals_biome) do
    FactoryBot.create(
      :api_v3_recolor_by_qual,
      recolor_by_attribute: recolor_by_attributes_biome,
      qual: api_v3_biome
    )
  end
end
