FactoryBot.define do
  factory :api_v3_quant_property, class: 'Api::V3::QuantProperty' do
    association :quant, factory: :api_v3_quant
    sequence(:display_name) { |n| "attribute #{n}" }
    unit_type { 'currency' }
    is_visible_on_place_profile { false }
    is_visible_on_actor_profile { false }
    is_temporal_on_place_profile { false }
    is_temporal_on_actor_profile { false }
  end
end
