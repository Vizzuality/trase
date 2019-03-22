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
        column_group: 0,
        role: 'source'
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
        column_group: 0,
        role: 'source'
      )
    end
    cnt
  end
  let!(:api_v3_municipality_context_node) do
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
        role: 'source',
        is_default: true
      )
      FactoryBot.create(
        :api_v3_profile,
        context_node_type: cnt,
        adm_1_topojson_path: 'adm_1_topojson_path',
        adm_1_topojson_root: 'adm_1_topojson_root',
        adm_2_topojson_path: 'adm_2_topojson_path',
        adm_2_topojson_root: 'adm_2_topojson_root',
        main_topojson_path: 'main_topojson_path',
        main_topojson_root: 'main_topojson_root'
      )
    end
    cnt
  end
  let!(:api_v3_brazil_municipality_place_profile) do
    profile = Api::V3::Profile.where(
      context_node_type_id: api_v3_municipality_context_node,
      name: :place
    ).first
    profile || FactoryBot.create(
      :api_v3_profile,
      context_node_type: api_v3_municipality_context_node,
      name: :place
    )
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
        column_group: 0,
        role: 'source'
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
        column_group: 1,
        role: 'exporter'
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
        column_group: 1,
        role: 'exporter'
      )
    end
    cnt
  end
  let!(:api_v3_brazil_exporter_actor_profile) do
    profile = Api::V3::Profile.where(
      context_node_type_id: api_v3_exporter1_context_node,
      name: :actor
    ).first
    profile || FactoryBot.create(
      :api_v3_profile,
      context_node_type: api_v3_exporter1_context_node,
      name: :actor
    )
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
        column_group: 2,
        role: 'importer'
      )
    end
    cnt
  end
  let!(:api_v3_brazil_importer_actor_profile) do
    profile = Api::V3::Profile.where(
      context_node_type_id: api_v3_importer1_context_node,
      name: :actor
    ).first
    profile || FactoryBot.create(
      :api_v3_profile,
      context_node_type: api_v3_importer1_context_node,
      name: :actor
    )
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
        column_group: 3,
        role: 'destination'
      )
    end
    cnt
  end
end
