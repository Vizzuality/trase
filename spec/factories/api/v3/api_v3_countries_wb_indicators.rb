FactoryBot.define do
  factory :api_v3_countries_wb_indicator, class: 'Api::V3::CountriesWbIndicator' do
    sequence(:iso2) { |n| ('AA'..'ZZ').to_a[n] }
    sequence(:iso3) { |n| ('AA'..'ZZ').to_a[n] }
    sequence(:year) { |n| n }
    sequence(:name) { |n| "Name#{n}" }
    value { rand(11.2...76.9) }
    sequence(:rank) { |n| n }
  end
end
