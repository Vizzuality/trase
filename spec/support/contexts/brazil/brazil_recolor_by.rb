shared_context 'brazil recolor by' do
  include_context 'brazil contexts'
  include_context 'quals'
  include_context 'inds'

  let!(:recolor_by_forest_500) do
    FactoryGirl.create(:context_recolor_by, recolor_attribute: forest_500, tooltip_text: 'forest 500 tooltip text', context: context)
  end
  let!(:recolor_by_water_scarcity) do
    FactoryGirl.create(:context_recolor_by, recolor_attribute: water_scarcity, tooltip_text: 'water scarcity tooltip text', context: context)
  end
  let!(:recolor_by_biome) do
    FactoryGirl.create(:context_recolor_by, recolor_attribute: biome, tooltip_text: 'biome tooltip text', context: context)
  end
end
