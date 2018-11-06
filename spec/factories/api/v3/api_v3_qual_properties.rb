FactoryBot.define do
  factory :api_v3_qual_property, class: 'Api::V3::QualProperty' do
    association :qual, factory: :api_v3_qual
    sequence(:display_name) { |n| "attribute #{n}" }
    is_visible_on_place_profile { false }
    is_visible_on_actor_profile { false }
    is_temporal_on_place_profile { false }
    is_temporal_on_actor_profile { false }
  end
end
