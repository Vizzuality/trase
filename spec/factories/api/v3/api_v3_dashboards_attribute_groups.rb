FactoryBot.define do
  factory :api_v3_dashboards_attribute_group, class: "Api::V3::DashboardsAttributeGroup" do
    name { "Agricultural" }
    sequence(:position) { |n| n }
  end
end
