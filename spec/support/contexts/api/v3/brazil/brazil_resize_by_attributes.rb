shared_context 'api v3 brazil resize by attributes' do
  include_context 'api v3 brazil soy context'
  include_context 'api v3 quants'

  let!(:api_v3_volume_resize_by_attribute) do
    resize_by_attribute = Api::V3::ResizeByQuant.
      includes(:resize_by_attribute).
      where(
        'resize_by_attributes.context_id' => api_v3_brazil_soy_context.id,
        quant_id: api_v3_volume.id
      ).first&.resize_by_attribute
    unless resize_by_attribute
      resize_by_attribute = FactoryBot.create(
        :api_v3_resize_by_attribute,
        tooltip_text: 'Amount of the traded commodity (tonnes)',
        context: api_v3_brazil_soy_context,
        position: 1,
        years: [],
        group_number: 1,
        is_disabled: false,
        is_default: false
      )
      FactoryBot.create(
        :api_v3_resize_by_quant,
        resize_by_attribute: resize_by_attribute,
        quant: api_v3_volume
      )
    end
    resize_by_attribute
  end

  let!(:api_v3_fob_resize_by_attribute) do
    resize_by_attribute = Api::V3::ResizeByQuant.
      includes(:resize_by_attribute).
      where(
        'resize_by_attributes.context_id' => api_v3_brazil_soy_context.id,
        quant_id: api_v3_fob.id
      ).first&.resize_by_attribute
    unless resize_by_attribute
      resize_by_attribute = FactoryBot.create(
        :api_v3_resize_by_attribute,
        tooltip_text: 'Value of the traded product in US dollars',
        context: api_v3_brazil_soy_context,
        position: 2,
        years: [],
        group_number: 1,
        is_disabled: false,
        is_default: false
      )
      FactoryBot.create(
        :api_v3_resize_by_quant,
        resize_by_attribute: resize_by_attribute,
        quant: api_v3_fob
      )
    end
    resize_by_attribute
  end
end
