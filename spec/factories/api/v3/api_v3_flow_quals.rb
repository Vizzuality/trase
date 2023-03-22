FactoryBot.define do
  factory :api_v3_flow_qual, class: "Api::V3::FlowQual" do
    association :flow, factory: :api_v3_flow
    association :qual, factory: :api_v3_qual
    value { "yes" }
  end
end
