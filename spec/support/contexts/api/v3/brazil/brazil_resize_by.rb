shared_context 'api v3 brazil resize by' do
  include_context 'api v3 brazil contexts'
  include_context 'api v3 quants'

  let!(:resize_by_attributes_area) do
    FactoryBot.create(
      :api_v3_resize_by_attribute,
      tooltip_text: 'area tooltip text',
      context: api_v3_context,
      position: 1,
      years: [],
      group_number: 1,
      is_disabled: false,
      is_default: false
    )
  end
  let!(:resize_by_quants_area) do
    FactoryBot.create(
      :api_v3_resize_by_quant,
      resize_by_attribute: resize_by_attributes_area,
      quant: api_v3_area
    )
  end

  let!(:resize_by_attributes_land_conflict) do
    FactoryBot.create(
      :api_v3_resize_by_attribute,
      tooltip_text: 'land conflict tooltip text',
      context: api_v3_context,
      position: 2,
      years: [],
      group_number: 1,
      is_disabled: false,
      is_default: false
    )
  end
  let!(:resize_by_quants_land_conflict) do
    FactoryBot.create(
      :api_v3_resize_by_quant,
      resize_by_attribute: resize_by_attributes_land_conflict,
      quant: api_v3_land_conflicts
    )
  end
end
