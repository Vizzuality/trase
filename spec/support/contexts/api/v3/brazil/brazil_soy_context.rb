shared_context 'api v3 brazil soy context' do
  include_context 'api v3 brazil country'
  include_context 'api v3 commodities'

  let!(:api_v3_brazil_soy_context) do
    Api::V3::Context.where(
      country_id: api_v3_brazil.id, commodity_id: api_v3_soy.id
    ).first ||
      FactoryBot.create(
        :api_v3_context,
        country: api_v3_brazil,
        commodity: api_v3_soy,
        years: [2014, 2015],
        default_year: 2015
      )
  end
  let!(:api_v3_brazil_soy_context_property) do
    Api::V3::ContextProperty.find_by_context_id(api_v3_brazil_soy_context.id) ||
      FactoryBot.create(
        :api_v3_context_property,
        context: api_v3_brazil_soy_context,
        is_disabled: false,
        is_default: false,
        subnational_years: [2014, 2015]
      )
  end
end
