FactoryBot.define do
  factory :api_v3_flow_ind, class: "Api::V3::FlowInd" do
    association :flow, factory: :api_v3_flow
    association :ind, factory: :api_v3_ind
    value { 1 }
  end
end
