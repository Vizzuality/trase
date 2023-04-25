FactoryBot.define do
  factory :api_v3_qual, class: "Api::V3::Qual" do
    sequence(:name) { |n| "qual #{n}" }
  end
end
