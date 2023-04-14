FactoryBot.define do
  factory :api_v3_flow_quant, class: "Api::V3::FlowQuant" do
    association :flow, factory: :api_v3_flow
    association :quant, factory: :api_v3_quant
    value { 1 }
  end
end
