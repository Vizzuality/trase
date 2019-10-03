FactoryBot.define do
  factory :api_v3_sankey_card_link, class: 'Api::V3::SankeyCardLink' do
    sequence(:title) { |n| "Title#{n}" }
    sequence(:host) { |n| "host#{n}.com" }
    query_params {
      {
        'selectedCommodityId' => Api::V3::Commodity.find_by(name: 'BEEF').id,
        'selectedCountryId' => Api::V3::Country.find_by(name: 'BRAZIL').id,
        'selectedResizeBy' => Api::V3::Readonly::Attribute.first.id,
        'selectedRecolorBy' => Api::V3::Readonly::Attribute.first.id
      }
    }
  end
end
