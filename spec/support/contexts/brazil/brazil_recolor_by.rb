shared_context 'brazil recolor by' do
  include_context 'brazil contexts'
  include_context 'quals'
  include_context 'inds'

  let!(:recolor_by_forest_500) do
    FactoryBot.create(:context_recolor_by, recolor_attribute: forest_500, tooltip_text: 'forest 500 tooltip text', context: context, position: 1)
  end
  let!(:recolor_by_water_scarcity) do
    FactoryBot.create(:context_recolor_by, recolor_attribute: water_scarcity, tooltip_text: 'water scarcity tooltip text', context: context, position: 2)
  end
  let!(:recolor_by_biome) do
    FactoryBot.create(:context_recolor_by, recolor_attribute: biome, tooltip_text: 'biome tooltip text', context: context, position: 3)
  end
end
