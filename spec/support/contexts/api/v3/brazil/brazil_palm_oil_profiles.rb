shared_context "api v3 brazil palm oil profiles" do
  include_context "api v3 brazil context node types"

  let!(:api_v3_brazil_palm_oil_exporter_actor_profile) do
    profile = Api::V3::Profile.where(
      context_node_type_id: api_v3_brazil_palm_oil_exporter_context_node_type.id,
      name: Api::V3::Profile::ACTOR
    ).first
    profile || FactoryBot.create(
      :api_v3_profile,
      context_node_type: api_v3_brazil_palm_oil_exporter_context_node_type,
      name: Api::V3::Profile::ACTOR
    )
  end

  let!(:api_v3_brazil_palm_oil_exporter_country_profile) do
    profile = Api::V3::Profile.where(
      context_node_type_id: api_v3_brazil_palm_oil_country_of_production_context_node_type,
      name: :country
    ).first
    profile || FactoryBot.create(
      :api_v3_profile,
      context_node_type: api_v3_brazil_palm_oil_country_of_production_context_node_type,
      name: :country
    )
  end

  let!(:api_v3_brazil_palm_oil_importer_country_profile) do
    profile = Api::V3::Profile.where(
      context_node_type_id: api_v3_brazil_palm_oil_country_context_node_type,
      name: :country
    ).first
    profile || FactoryBot.create(
      :api_v3_profile,
      context_node_type: api_v3_brazil_palm_oil_country_context_node_type,
      name: :country
    )
  end
end
