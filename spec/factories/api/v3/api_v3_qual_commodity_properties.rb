FactoryBot.define do
  factory :api_v3_qual_commodity_property, class: "Api::V3::QualCommodityProperty" do
    association :qual, factory: :api_v3_qual
    association :commodity, factory: :api_v3_commodity
    tooltip_text { "Commodity specific tooltip text for QUAL" }
    display_name { "Commodity specific display name for QUAL" }
  end
end
