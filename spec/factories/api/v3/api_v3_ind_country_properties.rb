FactoryBot.define do
  factory :api_v3_ind_country_property, class: "Api::V3::IndCountryProperty" do
    association :ind, factory: :api_v3_ind
    association :country, factory: :api_v3_country
    tooltip_text { "Country specific tooltip text for IND" }
    display_name { "Country specific display name for IND" }
  end
end
