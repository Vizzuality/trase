FactoryBot.define do
  factory :api_v3_dashboards_attribute, class: "Api::V3::DashboardsAttribute" do
    association :dashboards_attribute_group, factory: :api_v3_dashboards_attribute_group
    sequence(:position) { |n| n }
  end
end
