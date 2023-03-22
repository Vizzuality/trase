FactoryBot.define do
  factory :api_v3_map_attribute, class: "Api::V3::MapAttribute" do
    association :map_attribute_group, factory: :api_v3_map_attribute_group
    sequence(:position) { |n| n }
    dual_layer_buckets { [33, 50, 66] }
    single_layer_buckets { [20, 40, 60, 80] }
    is_disabled { false }
    is_default { false }
  end
end
