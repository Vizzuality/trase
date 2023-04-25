FactoryBot.define do
  factory :api_v3_carto_layer, class: "Api::V3::CartoLayer" do
    association :contextual_layer, factory: :api_v3_contextual_layer
    sequence(:identifier) { |n| "carto layer #{n}" }
  end
end
