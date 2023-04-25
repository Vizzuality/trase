FactoryBot.define do
  factory :api_v3_resize_by_attribute, class: "Api::V3::ResizeByAttribute" do
    association :context, factory: :api_v3_context
    sequence(:group_number) { |n| n }
    sequence(:position) { |n| n }
    is_disabled { false }
    is_default { false }
  end
end
