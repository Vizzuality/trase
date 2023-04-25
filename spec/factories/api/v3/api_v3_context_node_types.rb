FactoryBot.define do
  factory :api_v3_context_node_type, class: "Api::V3::ContextNodeType" do
    association :context, factory: :api_v3_context
    association :node_type, factory: :api_v3_node_type
    column_position { rand(4) }
  end
end
