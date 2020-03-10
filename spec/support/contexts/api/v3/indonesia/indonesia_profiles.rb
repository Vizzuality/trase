shared_context 'api v3 indonesia profiles' do
  include_context 'api v3 indonesia context node types'

  let!(:api_v3_indonesia_kabupaten_place_profile) do
    profile = Api::V3::Profile.where(
      context_node_type_id: api_v3_indonesia_kabupaten_context_node_type,
      name: :place
    ).first
    profile || FactoryBot.create(
      :api_v3_profile,
      context_node_type: api_v3_indonesia_kabupaten_context_node_type,
      name: :place
    )
  end

  let!(:api_v3_indonesia_exporter_actor_profile) do
    profile = Api::V3::Profile.where(
      context_node_type_id: api_v3_indonesia_exporter_context_node_type,
      name: :actor
    ).first
    profile || FactoryBot.create(
      :api_v3_profile,
      context_node_type: api_v3_indonesia_exporter_context_node_type,
      name: :actor
    )
  end

  let!(:api_v3_indonesia_importer_actor_profile) do
    profile = Api::V3::Profile.where(
      context_node_type_id: api_v3_indonesia_importer_context_node_type,
      name: :actor
    ).first
    profile || FactoryBot.create(
      :api_v3_profile,
      context_node_type: api_v3_indonesia_importer_context_node_type,
      name: :actor
    )
  end

  let!(:api_v3_indonesia_exporter_country_profile) do
    profile = Api::V3::Profile.where(
      context_node_type_id: api_v3_indonesia_country_of_production_context_node_type,
      name: :country
    ).first
    profile || FactoryBot.create(
      :api_v3_profile,
      context_node_type: api_v3_indonesia_country_of_production_context_node_type,
      name: :country
    )
  end

  let!(:api_v3_indonesia_importer_country_profile) do
    profile = Api::V3::Profile.where(
      context_node_type_id: api_v3_indonesia_country_context_node_type,
      name: :country
    ).first
    profile || FactoryBot.create(
      :api_v3_profile,
      context_node_type: api_v3_indonesia_country_context_node_type,
      name: :country
    )
  end
end
