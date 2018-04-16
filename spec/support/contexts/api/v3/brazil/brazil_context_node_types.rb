shared_context 'api v3 brazil context node types' do
  include_context 'api v3 brazil contexts'
  include_context 'api v3 node types'

  let!(:api_v3_biome_context_node) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_context.id, node_type_id: api_v3_biome_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_context,
        node_type: api_v3_biome_node_type,
        column_position: 0
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 0
      )
    end
    cnt
  end
  let!(:api_v3_state_context_node) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_context.id, node_type_id: api_v3_state_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_context,
        node_type: api_v3_state_node_type,
        column_position: 1
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 0
      )
    end
    cnt
  end
  let!(:municipality_context_node) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_context.id, node_type_id: api_v3_municipality_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_context,
        node_type: api_v3_municipality_node_type,
        column_position: 2
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 0,
        is_default: true
      )
      FactoryBot.create(
        :api_v3_profile,
        context_node_type: cnt
      )
    end
    cnt
  end
  let!(:api_v3_logistics_hub_context_node) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_context.id, node_type_id: api_v3_logistics_hub_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_context,
        node_type: api_v3_logistics_hub_node_type,
        column_position: 3
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 0
      )
    end
    cnt
  end
  let!(:api_v3_port1_context_node) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_context.id, node_type_id: api_v3_port_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_context,
        node_type: api_v3_port_node_type,
        column_position: 4
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 1
      )
    end
    cnt
  end
  let!(:api_v3_exporter1_context_node) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_context.id, node_type_id: api_v3_exporter_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_context,
        node_type: api_v3_exporter_node_type,
        column_position: 5
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 1
      )
    end
    cnt
  end
  let!(:api_v3_importer1_context_node) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_context.id, node_type_id: api_v3_importer_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_context,
        node_type: api_v3_importer_node_type,
        column_position: 6
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 2
      )
    end
    cnt
  end
  let!(:country_of_destination1_context_node) do
    cnt = Api::V3::ContextNodeType.where(
      context_id: api_v3_context.id, node_type_id: api_v3_country_node_type.id
    ).first
    unless cnt
      cnt = FactoryBot.create(
        :api_v3_context_node_type,
        context: api_v3_context,
        node_type: api_v3_country_node_type,
        column_position: 7
      )
      FactoryBot.create(
        :api_v3_context_node_type_property,
        context_node_type: cnt,
        column_group: 3
      )
    end
    cnt
  end
end
