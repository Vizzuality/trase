FactoryBot.define do
  factory :api_v3_sankey_card_link, class: "Api::V3::SankeyCardLink" do
    sequence(:title) { |n| "Title#{n}" }
    level1 { false }
    level2 { false }
    level3 { false }
    link {
      "http://localhost:8081/flows/data-view?countries=#{Api::V3::Country.find_by(name: "BRAZIL").id}&commodities=#{Api::V3::Commodity.find_by(name: "BEEF").id}"
    }
  end
end
