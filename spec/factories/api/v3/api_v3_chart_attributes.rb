FactoryBot.define do
  factory :api_v3_chart_attribute, class: "Api::V3::ChartAttribute" do
    association :chart, factory: :api_v3_chart
    sequence(:identifier) { |n| "attribute_#{n}" }
    sequence(:position) { |n| n }
  end
end
