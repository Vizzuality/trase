FactoryBot.define do
  factory :api_v3_quant_context_property, class: 'Api::V3::QuantContextProperty' do
    association :quant, factory: :api_v3_quant
    association :context, factory: :api_v3_context
    tooltip_text { 'Context specific tooltip text for QUANT' }
  end
end
