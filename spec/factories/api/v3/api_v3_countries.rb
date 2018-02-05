FactoryBot.define do
  factory :api_v3_country, class: 'Api::V3::Country' do
    sequence(:iso2) { |n| ('AA'..'ZZ').to_a[n] }
    name { iso2 + ' COUNTRY' }
  end
end
