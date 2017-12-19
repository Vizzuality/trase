shared_context 'api v3 brazil soy nodes' do
  include_context 'api v3 node types'
  include_context 'api v3 quals'
  include_context 'api v3 brazil context nodes'

  let!(:api_v3_state_node) do
    Api::V3::Node.where(
      name: 'MATO GROSSO', node_type_id: api_v3_state_node_type.id
    ).first ||
      FactoryBot.create(
        :api_v3_node,
        name: 'MATO GROSSO',
        node_type: api_v3_state_node_type,
        geo_id: 'BR51'
      )
  end
  let!(:api_v3_biome_node) do
    Api::V3::Node.where(
      name: 'AMAZONIA', node_type_id: api_v3_biome_node_type.id
    ).first ||
      FactoryBot.create(
        :api_v3_node,
        name: 'AMAZONIA',
        node_type: api_v3_biome_node_type,
        geo_id: 'BR1'
      )
  end
  let!(:api_v3_logistics_hub_node) do
    Api::V3::Node.where(
      name: 'CUIABA', node_type_id: api_v3_logistics_hub_node_type.id
    ).first ||
      FactoryBot.create(
        :api_v3_node,
        name: 'CUIABA',
        node_type: api_v3_logistics_hub_node_type
      )
  end
  let!(:api_v3_municipality_node) do
    Api::V3::Node.where(
      name: 'NOVA UBIRATA', node_type_id: api_v3_municipality_node_type.id
    ).first ||
      FactoryBot.create(
        :api_v3_node,
        name: 'NOVA UBIRATA',
        node_type: api_v3_municipality_node_type,
        geo_id: 'BR5106240'
      )
  end
  let!(:api_v3_other_municipality_node) do
    Api::V3::Node.where(
      name: 'OTHER', node_type_id: api_v3_municipality_node_type.id
    ).first ||
      FactoryBot.create(
        :api_v3_node,
        name: 'OTHER',
        node_type: api_v3_municipality_node_type
      )
  end
  let!(:api_v3_exporter1_node) do
    Api::V3::Node.where(
      name: 'AFG BRASIL', node_type_id: api_v3_exporter_node_type.id
    ).first ||
      FactoryBot.create(
        :api_v3_node,
        name: 'AFG BRASIL',
        node_type: api_v3_exporter_node_type
      )
  end
  let!(:api_v3_other_exporter_node) do
    Api::V3::Node.where(
      name: 'OTHER', node_type_id: api_v3_exporter_node_type.id
    ).first ||
      FactoryBot.create(
        :api_v3_node,
        name: 'OTHER',
        node_type: api_v3_exporter_node_type
      )
  end
  let!(:api_v3_port1_node) do
    Api::V3::Node.where(
      name: 'IMBITUBA', node_type_id: api_v3_port_node_type.id
    ).first ||
      FactoryBot.create(
        :api_v3_node,
        name: 'IMBITUBA',
        node_type: api_v3_port_node_type
      )
  end
  let!(:api_v3_importer1_node) do
    Api::V3::Node.where(
      name: 'UNKNOWN CUSTOMER', node_type_id: api_v3_importer_node_type.id
    ).first ||
      FactoryBot.create(
        :api_v3_node,
        name: 'UNKNOWN CUSTOMER',
        node_type: api_v3_importer_node_type
      )
  end
  let!(:api_v3_other_importer_node) do
    Api::V3::Node.where(
      name: 'OTHER', node_type_id: api_v3_importer_node_type.id
    ).first ||
      FactoryBot.create(
        :api_v3_node,
        name: 'OTHER',
        node_type: api_v3_importer_node_type
      )
  end
  let!(:api_v3_country_of_destination1_node) do
    Api::V3::Node.where(
      name: 'RUSSIAN FEDERATION', node_type_id: api_v3_country_node_type.id
    ).first ||
      FactoryBot.create(
        :api_v3_node,
        name: 'RUSSIAN FEDERATION',
        node_type: api_v3_country_node_type,
        geo_id: 'CN'
      )
  end
  let!(:api_v3_other_country_of_destination_node) do
    Api::V3::Node.where(
      name: 'OTHER', node_type_id: api_v3_country_node_type.id
    ).first ||
      FactoryBot.create(
        :api_v3_node,
        name: 'OTHER',
        node_type: api_v3_country_node_type
      )
  end
end
