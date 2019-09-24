FactoryBot.define do
  factory :api_v3_sankey_card_link, class: 'Api::V3::SankeyCardLink' do
    sequence(:title) { |n| "Title#{n}" }
    sequence(:host) { |n| "host#{n}.com" }
    query_params { {
      commodity_id: Api::V3::Commodity.first.id,
      country_id: Api::V3::Country.first.id,
      cont_attribute_id: Api::V3::Readonly::Attribute.first.id,
      ncont_attribute_id: Api::V3::Readonly::Attribute.first.id
    } }
  end
end
