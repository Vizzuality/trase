FactoryBot.define do
  factory :api_v3_chart, class: "Api::V3::Chart" do
    association :profile, factory: :api_v3_profile
    title { "Chart" }
    sequence(:identifier) { |n| "place_basic_attributes" }
    sequence(:position) { |n| n }
  end
end
