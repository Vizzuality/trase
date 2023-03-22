shared_context "api v3 dashboards attributes" do
  include_context "api v3 quals"
  include_context "api v3 inds"
  include_context "api v3 dashboards attribute groups"

  let!(:api_v3_zero_deforestation_dashboards_attribute) do
    dashboards_attribute = Api::V3::DashboardsQual.
      includes(:dashboards_attribute).
      where(
        "dashboards_attributes.dashboards_attribute_group_id" =>
          api_v3_dashboards_attribute_group_environmental.id,
        qual_id: api_v3_zero_deforestation.id
      ).first&.dashboards_attribute
    unless dashboards_attribute
      dashboards_attribute = FactoryBot.create(
        :api_v3_dashboards_attribute,
        dashboards_attribute_group_id: api_v3_dashboards_attribute_group_environmental.id,
        position: 1
      )
      FactoryBot.create(
        :api_v3_dashboards_qual,
        dashboards_attribute: dashboards_attribute,
        qual: api_v3_zero_deforestation
      )
    end
    dashboards_attribute
  end

  let!(:api_v3_forest_500_dashboards_attribute) do
    dashboards_attribute = Api::V3::DashboardsInd.
      includes(:dashboards_attribute).
      where(
        "dashboards_attributes.dashboards_attribute_group_id" =>
          api_v3_dashboards_attribute_group_environmental.id,
        ind_id: api_v3_forest_500.id
      ).first&.dashboards_attribute
    unless dashboards_attribute
      dashboards_attribute = FactoryBot.create(
        :api_v3_dashboards_attribute,
        dashboards_attribute_group_id: api_v3_dashboards_attribute_group_environmental.id,
        position: 2
      )
      FactoryBot.create(
        :api_v3_dashboards_ind,
        dashboards_attribute: dashboards_attribute,
        ind: api_v3_forest_500
      )
    end
    dashboards_attribute
  end
end
