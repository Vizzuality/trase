FactoryBot.define do
  factory :api_v3_profile, class: "Api::V3::Profile" do
    association :context_node_type, factory: :api_v3_context_node_type
    name { "place" }
  end
end
