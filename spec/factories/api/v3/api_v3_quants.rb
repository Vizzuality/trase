FactoryBot.define do
  factory :api_v3_quant, class: "Api::V3::Quant" do
    sequence(:name) { |n| "quant #{n}" }
  end
end
