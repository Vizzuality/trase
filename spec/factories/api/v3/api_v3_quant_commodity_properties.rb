FactoryBot.define do
  factory :api_v3_quant_commodity_property, class: "Api::V3::QuantCommodityProperty" do
    association :quant, factory: :api_v3_quant
    association :commodity, factory: :api_v3_commodity
    tooltip_text { "Commodity specific tooltip text for QUANT" }
    display_name { "Commodity specific display name for QUANT" }
  end
end
