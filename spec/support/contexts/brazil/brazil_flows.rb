shared_context 'brazil flows' do
  include_context 'brazil soy nodes'

  let!(:flow1) do
    FactoryBot.create(
      :flow,
      context: context,
      path: [
        biome_node, state_node, municipality_node, logistics_hub_node, port1_node, exporter1_node, importer1_node, country_of_destination1_node
      ].map(&:node_id),
      year: 2015
    )
  end
  let!(:flow2) do
    FactoryBot.create(
      :flow,
      context: context,
      path: [
        biome_node, state_node, municipality_node, logistics_hub_node, port1_node, exporter1_node, importer1_node, country_of_destination1_node
      ].map(&:node_id),
      year: 2015
    )
  end
end
