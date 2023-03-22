FactoryBot.define do
  factory :api_v3_dashboards_qual, class: "Api::V3::DashboardsQual" do
    association :dashboards_attribute, factory: :api_v3_dashboards_attribute
    association :qual, factory: :api_v3_qual
  end
end
