shared_context 'api v3 brazil contexts' do
  let!(:api_v3_brazil) do
    Api::V3::Country.find_by_iso2('BR') || FactoryBot.create(
      :api_v3_country,
      name: 'BRAZIL', iso2: 'BR'
    )
  end
  let!(:api_v3_context) do
    FactoryBot.create(
      :api_v3_context,
      country: api_v3_brazil,
      commodity: FactoryBot.create(:api_v3_commodity, name: 'SOY'),
      years: [2014, 2015],
      default_year: 2015
    )
  end
  let!(:api_v3_context_properties) do
    FactoryBot.create(
      :api_v3_context_property,
      context: api_v3_context,
      is_disabled: false,
      is_default: false
    )
  end
  let!(:api_v3_another_context) do
    FactoryBot.create(
      :api_v3_context,
      country: api_v3_brazil,
      commodity: FactoryBot.create(:api_v3_commodity, name: 'BEEF'),
      years: [2014, 2015],
      default_year: 2015
    )
  end
  let!(:api_v3_another_context_properties) do
    FactoryBot.create(
      :api_v3_context_property,
      context: api_v3_another_context,
      is_disabled: false,
      is_default: false
    )
  end
end
