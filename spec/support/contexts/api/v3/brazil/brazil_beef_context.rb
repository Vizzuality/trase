shared_context "api v3 brazil beef context" do
  include_context "api v3 brazil country"
  include_context "api v3 commodities"

  let!(:api_v3_brazil_beef_context) do
    Api::V3::Context.where(
      country_id: api_v3_brazil.id, commodity_id: api_v3_beef.id
    ).first ||
      FactoryBot.create(
        :api_v3_context,
        country: api_v3_brazil,
        commodity: api_v3_beef,
        years: [2014, 2015],
        default_year: 2015
      )
  end
  let!(:api_v3_brazil_beef_context_property) do
    Api::V3::ContextProperty.find_by_context_id(api_v3_brazil_beef_context.id) ||
      FactoryBot.create(
        :api_v3_context_property,
        context: api_v3_brazil_beef_context,
        is_disabled: false,
        is_default: false,
        is_highlighted: false,
        subnational_years: []
      )
  end
end
