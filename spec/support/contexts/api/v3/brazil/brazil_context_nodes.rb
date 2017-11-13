shared_context 'api v3 brazil context nodes' do
  include_context 'api v3 brazil contexts'
  include_context 'api v3 node types'

  let!(:api_v3_biome_context_node) do
    FactoryBot.create(
      :api_v3_context_node_type,
      context: api_v3_context,
      node_type: api_v3_biome_node_type,
      column_position: 0,
      column_group: 0
    )
  end
  let!(:api_v3_state_context_node) do
    FactoryBot.create(
      :api_v3_context_node_type,
      context: api_v3_context,
      node_type: api_v3_state_node_type,
      column_position: 1,
      column_group: 0
    )
  end
  let!(:municipality_context_node) do
    FactoryBot.create(
      :api_v3_context_node_type,
      context: api_v3_context,
      node_type: api_v3_municipality_node_type,
      column_position: 2,
      column_group: 0,
      is_default: true
    )
  end
  let!(:api_v3_logistics_hub_context_node) do
    FactoryBot.create(
      :api_v3_context_node_type,
      context: api_v3_context,
      node_type: api_v3_logistics_hub_node_type,
      column_position: 3,
      column_group: 0
    )
  end
  let!(:api_v3_port1_context_node) do
    FactoryBot.create(
      :api_v3_context_node_type,
      context: api_v3_context,
      node_type: api_v3_port_node_type,
      column_position: 4,
      column_group: 1
    )
  end
  let!(:api_v3_exporter1_context_node) do
    FactoryBot.create(
      :api_v3_context_node_type,
      context: api_v3_context,
      node_type: api_v3_exporter_node_type,
      column_position: 5,
      column_group: 1
    )
  end
  let!(:api_v3_importer1_context_node) do
    FactoryBot.create(
      :api_v3_context_node_type,
      context: api_v3_context,
      node_type: api_v3_importer_node_type,
      column_position: 6,
      column_group: 2
    )
  end
  let!(:country_of_destination1_context_node) do
    FactoryBot.create(
      :api_v3_context_node_type,
      context: api_v3_context,
      node_type: api_v3_country_node_type,
      column_position: 7,
      column_group: 3
    )
  end
end
