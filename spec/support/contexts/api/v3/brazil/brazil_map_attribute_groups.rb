shared_context "api v3 brazil map attribute groups" do
  include_context "api v3 brazil soy context"

  let!(:api_v3_map_attribute_group1) do
    Api::V3::MapAttributeGroup.where(
      context_id: api_v3_brazil_soy_context.id, position: 1
    ).first ||
      FactoryBot.create(
        :api_v3_map_attribute_group,
        context_id: api_v3_brazil_soy_context.id,
        name: "Context layer group one",
        position: 1
      )
  end

  let!(:api_v3_map_attribute_group2) do
    Api::V3::MapAttributeGroup.where(
      context_id: api_v3_brazil_soy_context.id, position: 2
    ).first ||
      FactoryBot.create(
        :api_v3_map_attribute_group,
        context_id: api_v3_brazil_soy_context.id,
        name: "Context layer group two",
        position: 2
      )
  end
end
