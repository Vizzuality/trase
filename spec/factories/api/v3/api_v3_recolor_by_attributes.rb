FactoryBot.define do
  factory :api_v3_recolor_by_attribute, class: "Api::V3::RecolorByAttribute" do
    association :context, factory: :api_v3_context
    sequence(:group_number) { |n| n }
    sequence(:position) { |n| n }
    legend_type { "linear" }
    legend_color_theme { "blue-green" }
    is_disabled { false }
    is_default { false }
  end
end
