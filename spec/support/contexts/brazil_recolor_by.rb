shared_context 'brazil recolor by' do
  include_context 'quals'
  include_context 'inds'
  include_context 'brazil soy indicators'

  let!(:recolor_by_forest_500){
    FactoryGirl.create(:context_recolor_by, recolor_attribute: forest_500, tooltip_text: 'forest 500 tooltip text', context: context)
  }
  let!(:recolor_by_water_scarcity){
    FactoryGirl.create(:context_recolor_by, recolor_attribute: water_scarcity, tooltip_text: 'water scarcity tooltip text', context: context)
  }
  let!(:recolor_by_biome){
    FactoryGirl.create(:context_recolor_by, recolor_attribute: biome, tooltip_text: 'biome tooltip text', context: context)
  }
end
