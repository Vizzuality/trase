shared_context 'api v3 indonesia context' do
  let!(:api_v3_indonesia) do
    Api::V3::Country.find_by_iso2('ID') || FactoryBot.create(
      :api_v3_country,
      name: 'INDONESIA', iso2: 'ID'
    )
  end
  let!(:api_v3_indonesia_properties) do
    Api::V3::CountryProperty.find_by_country_id(api_v3_indonesia.id) ||
      FactoryBot.create(
        :api_v3_country_property,
        country: api_v3_indonesia,
        latitude: -2.28,
        longitude: 117.37,
        zoom: 3
      )
  end

  let!(:api_v3_palm_oil) do
    Api::V3::Commodity.find_by_name('PALM OIL') ||
      FactoryBot.create(:api_v3_commodity, name: 'PALM OIL')
  end

  let!(:api_v3_indonesia_context) do
    Api::V3::Context.where(
      country_id: api_v3_indonesia.id, commodity_id: api_v3_palm_oil.id
    ).first ||
      FactoryBot.create(
        :api_v3_context,
        country: api_v3_indonesia,
        commodity: api_v3_palm_oil,
        years: [2014, 2015, 2016], # 2015 is subnational
        default_year: 2015
      )
  end

  let!(:api_v3_indonesia_context_property) do
    Api::V3::ContextProperty.find_by_context_id(api_v3_indonesia_context.id) ||
      FactoryBot.create(
        :api_v3_context_property,
        context: api_v3_indonesia_context,
        is_disabled: false,
        is_subnational: true,
        is_default: false
      )
  end
end
