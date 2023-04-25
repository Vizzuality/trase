FactoryBot.define do
  factory :api_v3_node_quant, class: "Api::V3::NodeQuant" do
    association :node, factory: :api_v3_node
    association :quant, factory: :api_v3_quant
    value { 1 }
  end
end
