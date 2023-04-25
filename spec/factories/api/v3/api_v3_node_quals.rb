FactoryBot.define do
  factory :api_v3_node_qual, class: "Api::V3::NodeQual" do
    association :node, factory: :api_v3_node
    association :qual, factory: :api_v3_qual
    value { "yes" }
  end
end
