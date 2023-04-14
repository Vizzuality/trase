FactoryBot.define do
  factory :api_v3_qual_country_property, class: "Api::V3::QualCountryProperty" do
    association :qual, factory: :api_v3_qual
    association :country, factory: :api_v3_country
    tooltip_text { "Country specific tooltip text for QUAL" }
    display_name { "Country specific display name for QUAL" }
  end
end
