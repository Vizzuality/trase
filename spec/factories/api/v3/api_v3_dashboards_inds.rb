FactoryBot.define do
  factory :api_v3_dashboards_ind, class: "Api::V3::DashboardsInd" do
    association :dashboards_attribute, factory: :api_v3_dashboards_attribute
    association :ind, factory: :api_v3_ind
  end
end
