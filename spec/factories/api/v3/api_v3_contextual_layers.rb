FactoryBot.define do
  factory :api_v3_contextual_layer, class: "Api::V3::ContextualLayer" do
    association :context, factory: :api_v3_context
    title { "Title" }
    sequence(:identifier) { |n| "layer #{n}" }
    sequence(:position) { |n| n }
    is_default { false }
  end
end
