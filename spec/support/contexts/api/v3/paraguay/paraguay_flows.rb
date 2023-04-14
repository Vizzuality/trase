shared_context "api v3 paraguay flows" do
  include_context "api v3 paraguay soy nodes"

  let!(:api_v3_paraguay_flow) do
    FactoryBot.create(
      :api_v3_flow,
      context: api_v3_paraguay_context,
      path: [
        api_v3_paraguay_biome_node,
        api_v3_paraguay_department_node,
        api_v3_paraguay_customs_department_node,
        api_v3_paraguay_exporter_node,
        api_v3_paraguay_country_node
      ].map(&:id),
      year: 2015
    )
  end
end
