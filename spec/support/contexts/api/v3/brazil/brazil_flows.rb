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

  # second destination node - there can be only ONE destination in a single flow
  let!(:api_v3_flow3) do
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
        api_v3_other_country_of_destination_node
      ].map(&:id),
      year: 2015
    )
  end

  # second exporter
  let!(:api_v3_flow4) do
    FactoryBot.create(
      :api_v3_flow,
      context: api_v3_context,
      path: [
        api_v3_biome_node,
        api_v3_state_node,
        api_v3_municipality_node,
        api_v3_logistics_hub_node,
        api_v3_port1_node,
        api_v3_other_exporter_node,
        api_v3_importer1_node,
        api_v3_country_of_destination1_node
      ].map(&:id),
      year: 2015
    )
  end

  # second importer
  let!(:api_v3_flow5) do
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
        api_v3_other_importer_node,
        api_v3_country_of_destination1_node
      ].map(&:id),
      year: 2015
    )
  end

  # other municipality
  let!(:api_v3_flow6) do
    FactoryBot.create(
      :api_v3_flow,
      context: api_v3_context,
      path: [
        api_v3_biome_node,
        api_v3_state_node,
        api_v3_municipality2_node,
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
