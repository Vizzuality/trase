shared_context "api v3 paraguay flows quals" do
  include_context "api v3 paraguay flows"
  include_context "api v3 quants"

  let!(:api_v3_paraguay_biome) do
    FactoryBot.create(
      :api_v3_flow_qual,
      flow: api_v3_paraguay_flow,
      qual: api_v3_biome,
      value: "Chaco seco"
    )
  end
end
