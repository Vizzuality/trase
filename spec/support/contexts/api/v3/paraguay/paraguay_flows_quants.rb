shared_context "api v3 paraguay flows quants" do
  include_context "api v3 paraguay flows"
  include_context "api v3 quants"

  let!(:api_v3_paraguay_flow_volume) do
    FactoryBot.create(
      :api_v3_flow_quant,
      flow: api_v3_paraguay_flow,
      quant: api_v3_volume,
      value: 10
    )
  end
end
