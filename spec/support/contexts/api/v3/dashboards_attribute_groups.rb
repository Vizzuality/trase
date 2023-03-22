shared_context "api v3 dashboards attribute groups" do
  let!(:api_v3_dashboards_attribute_group_environmental) do
    Api::V3::DashboardsAttributeGroup.where(
      position: 1
    ).first ||
      FactoryBot.create(
        :api_v3_dashboards_attribute_group,
        name: "Environmental",
        position: 1
      )
  end
end
