FactoryBot.define do
  factory :api_v3_node_ind, class: "Api::V3::NodeInd" do
    association :node, factory: :api_v3_node
    association :ind, factory: :api_v3_ind
    value { 1 }
  end
end
