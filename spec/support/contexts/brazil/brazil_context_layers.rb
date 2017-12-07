shared_context 'brazil context layers' do
  include_context 'brazil contexts'
  include_context 'inds'
  include_context 'quants'

  let!(:context_layer_group_one) do
    FactoryBot.create(
      :context_layer_group,
      context_id: context.id, name: 'Context layer group one',
      position: 1
    )
  end

  let!(:context_layer_group_two) do
    FactoryBot.create(
      :context_layer_group,
      context_id: context.id, name: 'Context layer group two',
      position: 2
    )
  end

  let!(:forest_500_context_layer) do
    FactoryBot.create(
      :context_layer,
      context_id: context.id, layer_attribute_type: 'Ind', layer_attribute_id: forest_500.id, context_layer_group_id: context_layer_group_one.id,
      position: 3
    )
  end

  let!(:water_scarcity_context_layer) do
    FactoryBot.create(
      :context_layer,
      context_id: context.id, layer_attribute_type: 'Ind', layer_attribute_id: water_scarcity.id, context_layer_group_id: context_layer_group_two.id,
      position: 4
    )
  end

  let!(:land_conflicts_context_layer) do
    FactoryBot.create(
      :context_layer,
      context_id: context.id, layer_attribute_type: 'Quant', layer_attribute_id: land_conflicts.id, context_layer_group_id: context_layer_group_one.id,
      position: 5
    )
  end

  let!(:force_labour_context_layer) do
    FactoryBot.create(
      :context_layer,
      context_id: context.id, layer_attribute_type: 'Quant', layer_attribute_id: force_labour.id, context_layer_group_id: context_layer_group_two.id,
      position: 6
    )
  end
end
