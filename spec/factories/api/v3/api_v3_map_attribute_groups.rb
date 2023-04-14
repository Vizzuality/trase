FactoryBot.define do
  factory :api_v3_map_attribute_group, class: "Api::V3::MapAttributeGroup" do
    association :context, factory: :api_v3_context
    name { "Group" }
    sequence(:position) { |n| n }
  end
end
