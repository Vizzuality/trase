shared_context 'api v3 brazil flows' do
  include_context 'api v3 brazil soy nodes'

  let!(:api_v3_flow1) do
    FactoryBot.create(
      :api_v3_flow,
      context: api_v3_context,
      path: [
        api_v3_biome_node,
        api_v3_state_node,
        api_v3_municipality_node,
        api_v3_logistics_hub_node,
        api_v3_port1_node,
        api_v3_exporter1_node,
        api_v3_importer1_node,
        api_v3_country_of_destination1_node
      ].map(&:id),
      year: 2015
    )
  end
  let!(:api_v3_flow2) do
    FactoryBot.create(
      :api_v3_flow,
      context: api_v3_context,
      path: [
        api_v3_biome_node,
        api_v3_state_node,
        api_v3_municipality_node,
        api_v3_logistics_hub_node,
        api_v3_port1_node,
        api_v3_exporter1_node,
        api_v3_importer1_node,
        api_v3_country_of_destination1_node
      ].map(&:id),
      year: 2015
    )
  end
end
