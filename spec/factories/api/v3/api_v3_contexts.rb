FactoryBot.define do
  factory :api_v3_context, class: "Api::V3::Context" do
    association :country, factory: :api_v3_country
    association :commodity, factory: :api_v3_commodity
  end
end
