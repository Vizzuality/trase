FactoryBot.define do
  factory :api_v3_countries_com_trade_indicator, class: "Api::V3::CountriesComTradeIndicator" do
    association :commodity, factory: :api_v3_commodity
    sequence(:iso2) { |n| ("AA".."ZZ").to_a[n] }
    sequence(:iso3) { |n| ("AA".."ZZ").to_a[n] }
    sequence(:year) { |n| n }
    sequence(:commodity_code) { |n| "Name#{n}" }
    value { rand(11.2...76.9) }
    quantity { rand(11.2...76.9) }
    sequence(:value_rank) { |n| n }
    sequence(:quantity_rank) { |n| n }
  end
end
