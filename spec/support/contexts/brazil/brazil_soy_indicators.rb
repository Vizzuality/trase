shared_context 'brazil soy indicators' do
  include_context 'inds'
  include_context 'quals'
  include_context 'quants'
  include_context 'brazil contexts'

  let!(:forest_500_context_indicators) do
    ContextIndicator.where(
      context_id: context.id,
      indicator_attribute_type: forest_500.class.name,
      indicator_attribute_id: forest_500.id
    ).first ||
      FactoryBot.create(
        :context_indicator,
        context: context,
        indicator: forest_500,
        name_in_download: 'FOREST 500',
        position: 1
      )
  end

  let!(:deforestation_v2_context_indicators) do
    ContextIndicator.where(
      context_id: context.id,
      indicator_attribute_type: deforestation_v2.class.name,
      indicator_attribute_id: deforestation_v2.id
    ).first ||
      FactoryBot.create(
        :context_indicator,
        context: context,
        indicator: deforestation_v2,
        name_in_download: 'DEFORESTATION',
        position: 2
      )
  end

  let!(:zero_deforestation_context_indicators) do
    ContextIndicator.where(
      context_id: context.id,
      indicator_attribute_type: zero_deforestation.class.name,
      indicator_attribute_id: zero_deforestation.id
    ).first ||
      FactoryBot.create(
        :context_indicator,
        context: context,
        indicator: zero_deforestation,
        name_in_download: 'ZERO DEFORESTATION',
        position: 3
      )
  end

  let!(:beef_context_indicators) do
    ContextIndicator.where(
      context_id: another_context.id,
      indicator_attribute_type: fob.class.name,
      indicator_attribute_id: fob.id
    ).first ||
      FactoryBot.create(
        :context_indicator,
        context: another_context,
        indicator: fob,
        name_in_download: 'FOB',
        position: 1
      )
  end
end
