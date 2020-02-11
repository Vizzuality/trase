FactoryBot.define do
  factory :api_v3_sankey_card_link, class: 'Api::V3::SankeyCardLink' do
    sequence(:title) { |n| "Title#{n}" }
    level3 { true }
    link {
      "http://localhost:8081/flows/data-view?countries=#{Api::V3::Country.find_by(name: 'BRAZIL').id}&commodities=#{Api::V3::Commodity.find_by(name: 'BEEF').id}"
    }
    # query_params {
    #   {
    #     'countries' => Api::V3::Commodity.find_by(name: 'BEEF').id,
    #     'commodities' => Api::V3::Country.find_by(name: 'BRAZIL').id,
    #     'selectedResizeBy' => Api::V3::Readonly::Attribute.first.id,
    #     'selectedRecolorBy' => Api::V3::Readonly::Attribute.first.id
    #   }
    # }
  end
end
