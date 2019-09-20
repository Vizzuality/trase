FactoryBot.define do
  factory :api_v3_sankey_card_link, class: 'Api::V3::SankeyCardLink' do
    sequence(:title) { |n| "Title#{n}" }
    sequence(:link) { |n| {property: n} }
  end
end
