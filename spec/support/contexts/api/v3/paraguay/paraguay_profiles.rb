shared_context "api v3 paraguay profiles" do
  include_context "api v3 paraguay context node types"

  let!(:api_v3_paraguay_department_place_profile) do
    profile = Api::V3::Profile.where(
      context_node_type_id: api_v3_paraguay_department_context_node,
      name: :place
    ).first
    profile || FactoryBot.create(
      :api_v3_profile,
      context_node_type: api_v3_paraguay_department_context_node,
      name: :place
    )
  end

  let!(:api_v3_paraguay_exporter_actor_profile) do
    profile = Api::V3::Profile.where(
      context_node_type_id: api_v3_paraguay_exporter_context_node,
      name: :actor
    ).first
    profile || FactoryBot.create(
      :api_v3_profile,
      context_node_type: api_v3_paraguay_exporter_context_node,
      name: :actor
    )
  end
end
