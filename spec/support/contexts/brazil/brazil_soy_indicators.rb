shared_context 'brazil soy indicators' do
  include_context 'inds'
  include_context 'quals'
  include_context 'quants'
  include_context 'brazil contexts'

  let!(:forest_500_context_indicators) do
    FactoryGirl.create(:context_indicator, context: context, indicator: forest_500, name_in_download: 'FOREST 500', position: 1)
  end

  let!(:deforestation_v2_context_indicators) do
    FactoryGirl.create(:context_indicator, context: context, indicator: deforestation_v2, name_in_download: 'DEFORESTATION', position: 2)
  end

  let!(:zero_deforestation_context_indicators) do
    FactoryGirl.create(:context_indicator, context: context, indicator: zero_deforestation, name_in_download: 'ZERO DEFORESTATION', position: 3)
  end

  let!(:beef_context_indicators) do
    FactoryGirl.create(:context_indicator, context: another_context, indicator: fob, name_in_download: 'FOB', position: 1)
  end
end
