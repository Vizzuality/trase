FactoryBot.define do
  factory :api_v3_dashboards_quant, class: "Api::V3::DashboardsQuant" do
    association :dashboards_attribute, factory: :api_v3_dashboards_attribute
    association :quant, factory: :api_v3_quant
  end
end
