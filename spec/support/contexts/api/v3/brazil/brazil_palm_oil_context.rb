shared_context 'api v3 brazil palm oil context' do
  include_context 'api v3 brazil country'
  include_context 'api v3 commodities'

  let!(:api_v3_brazil_palm_oil_context) do
    Api::V3::Context.where(
      country_id: api_v3_brazil.id, commodity_id: api_v3_palm_oil.id
    ).first ||
      FactoryBot.create(
        :api_v3_context,
        country: api_v3_brazil,
        commodity: api_v3_palm_oil,
        years: [2014, 2015],
        subnational_years: [],
        default_year: 2015
      )
  end
  let!(:api_v3_brazil_palm_oil_context_property) do
    Api::V3::ContextProperty.find_by_context_id(api_v3_brazil_palm_oil_context.id) ||
      FactoryBot.create(
        :api_v3_context_property,
        context: api_v3_brazil_palm_oil_context,
        is_disabled: false,
        is_default: false
      )
  end
end
