FactoryBot.define do
  factory :api_v3_top_profile, class: "Api::V3::TopProfile" do
    association :context, factory: :api_v3_context
    association :node, factory: :api_v3_node
  end
end
