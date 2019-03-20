shared_context 'api v3 brazil flows quals' do
  include_context 'api v3 brazil flows'
  include_context 'api v3 quants'

  let!(:api_v3_brazil_biome) do
    FactoryBot.create(
      :api_v3_flow_qual,
      flow: api_v3_flow1,
      qual: api_v3_biome,
      value: 'Amazonia'
    )
  end
end
