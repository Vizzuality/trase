FactoryBot.define do
  factory :api_v3_ind_commodity_property, class: "Api::V3::IndCommodityProperty" do
    association :ind, factory: :api_v3_ind
    association :commodity, factory: :api_v3_commodity
    tooltip_text { "Commodity specific tooltip text for IND" }
    display_name { "Commodity specific display name for IND" }
  end
end
