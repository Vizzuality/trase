FactoryBot.define do
  factory :api_v3_quant_country_property, class: "Api::V3::QuantCountryProperty" do
    association :quant, factory: :api_v3_quant
    association :country, factory: :api_v3_country
    tooltip_text { "Country specific tooltip text for QUANT" }
    display_name { "Country specific display name for QUANT" }
  end
end
