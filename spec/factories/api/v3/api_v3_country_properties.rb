FactoryBot.define do
  factory :api_v3_country_property, class: "Api::V3::CountryProperty" do
    association :country, factory: :api_v3_country
    latitude { -16.0 }
    longitude { -50.0 }
    zoom { 4 }
  end
end
