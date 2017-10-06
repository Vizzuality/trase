shared_context 'brazil resize by' do
  include_context 'quants'
  include_context 'brazil soy indicators'

  let!(:resize_by_area){
    FactoryGirl.create(:context_resize_by, resize_attribute: area, tooltip_text: 'area tooltip text', context: context)
  }
  let!(:resize_by_land_conflicts){
    FactoryGirl.create(:context_resize_by, resize_attribute: land_conflicts, tooltip_text: 'land conflicts tooltip text', context: context)
  }
end
