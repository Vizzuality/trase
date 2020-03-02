FactoryBot.define do
  factory :api_v3_quant_property, class: 'Api::V3::QuantProperty' do
    association :quant, factory: :api_v3_quant
    sequence(:display_name) { |n| "attribute #{n}" }
    unit_type { 'currency' }
  end
end
