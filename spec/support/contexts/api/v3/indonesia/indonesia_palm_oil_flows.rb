shared_context "api v3 indonesia palm oil flows" do
  include_context "api v3 indonesia palm oil nodes"

  let!(:api_v3_indonesia_palm_oil_flow) do
    FactoryBot.create(
      :api_v3_flow,
      context: api_v3_indonesia_context,
      path: [
        api_v3_indonesia_country_of_production_node,
        api_v3_indonesia_kabupaten_node,
        api_v3_indonesia_mill_node,
        api_v3_indonesia_port_of_export_node,
        api_v3_indonesia_exporter_node,
        api_v3_indonesia_importer_node,
        api_v3_indonesia_economic_bloc_node,
        api_v3_indonesia_country_node
      ].map(&:id),
      year: 2015
    )
  end
end
