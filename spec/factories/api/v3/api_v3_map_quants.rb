FactoryBot.define do
  factory :api_v3_map_quant, class: "Api::V3::MapQuant" do
    association :map_attribute, factory: :api_v3_map_attribute
    association :quant, factory: :api_v3_quant
  end
end
