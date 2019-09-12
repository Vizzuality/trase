shared_context 'api v3 brazil soy profiles' do
  include_context 'api v3 brazil context node types'

  let!(:api_v3_brazil_exporter_actor_profile) do
    profile = Api::V3::Profile.where(
      context_node_type_id: api_v3_exporter1_context_node.id,
      name: Api::V3::Profile::ACTOR
    ).first
    profile || FactoryBot.create(
      :api_v3_profile,
      context_node_type: api_v3_exporter1_context_node,
      name: Api::V3::Profile::ACTOR
    )
  end

  let!(:api_v3_brazil_importer_actor_profile) do
    profile = Api::V3::Profile.where(
      context_node_type_id: api_v3_importer1_context_node.id,
      name: Api::V3::Profile::ACTOR
    ).first
    profile || FactoryBot.create(
      :api_v3_profile,
      context_node_type: api_v3_importer1_context_node,
      name: Api::V3::Profile::ACTOR
    )
  end

  let!(:api_v3_brazil_municipality_place_profile) do
    profile = Api::V3::Profile.where(
      context_node_type_id: api_v3_municipality_context_node.id,
      name: Api::V3::Profile::PLACE
    ).first
    profile || FactoryBot.create(
      :api_v3_profile,
      context_node_type: api_v3_municipality_context_node,
      name: Api::V3::Profile::PLACE,
      adm_1_topojson_path: 'adm_1_topojson_path',
      adm_1_topojson_root: 'adm_1_topojson_root',
      adm_2_topojson_path: 'adm_2_topojson_path',
      adm_2_topojson_root: 'adm_2_topojson_root',
      main_topojson_path: 'main_topojson_path',
      main_topojson_root: 'main_topojson_root'
    )
  end
end
