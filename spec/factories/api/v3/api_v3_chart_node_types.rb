FactoryBot.define do
  factory :api_v3_chart_node_type, class: "Api::V3::ChartNodeType" do
    association :chart, factory: :api_v3_chart
    association :node_type, factory: :api_v3_node_type
    sequence(:identifier) { |n| "node_type_#{n}" }
    sequence(:position) { |n| n }
  end
end
