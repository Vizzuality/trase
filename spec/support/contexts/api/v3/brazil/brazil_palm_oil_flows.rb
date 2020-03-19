shared_context 'api v3 brazil palm oil flows' do
  include_context 'api v3 brazil palm oil nodes'

  let!(:api_v3_flow1) do
    FactoryBot.create(
      :api_v3_flow,
      context: api_v3_brazil_palm_oil_context,
      path: [
        api_v3_brazil_palm_oil_country_of_production_node,
        api_v3_brazil_palm_oil_port_of_export_node,
        api_v3_brazil_palm_oil_exporter_node,
        api_v3_brazil_palm_oil_country_node,
        api_v3_brazil_palm_oil_economic_bloc_node
      ].map(&:id),
      year: 2015
    )
  end
end
