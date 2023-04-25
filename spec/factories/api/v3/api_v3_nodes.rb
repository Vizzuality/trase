FactoryBot.define do
  factory :api_v3_node, class: "Api::V3::Node" do
    association :node_type, factory: :api_v3_node_type
    sequence(:name) { |n| "node #{n}" }
  end
end
