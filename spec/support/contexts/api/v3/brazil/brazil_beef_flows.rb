shared_context "api v3 brazil beef flows" do
  include_context "api v3 brazil beef nodes"

  let!(:api_v3_flow1) do
    FactoryBot.create(
      :api_v3_flow,
      context: api_v3_brazil_beef_context,
      path: [
        api_v3_brazil_beef_country_of_production_node,
        api_v3_brazil_beef_port_of_export_node,
        api_v3_brazil_beef_exporter_node,
        api_v3_importer_node,
        api_v3_country_of_destination_node
      ].map(&:id),
      year: 2015
    )
  end
end
