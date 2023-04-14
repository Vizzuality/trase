FactoryBot.define do
  factory :api_v3_commodity, class: "Api::V3::Commodity" do
    sequence(:name) { |n| "COMMODITY #{n}" }
  end
end
