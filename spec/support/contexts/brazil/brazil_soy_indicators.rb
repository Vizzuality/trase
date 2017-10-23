shared_context 'brazil soy indicators' do
  include_context 'inds'
  include_context 'quals'
  include_context 'quants'
  include_context 'brazil contexts'

  let!(:forest_500_context_indicators) {
    FactoryGirl.create(:context_indicator, context: context, indicator: forest_500)
  }

  let!(:deforestation_v2_context_indicators) {
    FactoryGirl.create(:context_indicator, context: context, indicator: deforestation_v2)
  }

  let!(:zero_deforestation_context_indicators) {
    FactoryGirl.create(:context_indicator, context: context, indicator: zero_deforestation)
  }

  let!(:beef_context_indicators) {
    FactoryGirl.create(:context_indicator, context: another_context, indicator: fob)
  }
end
