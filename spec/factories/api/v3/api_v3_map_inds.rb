FactoryBot.define do
  factory :api_v3_map_ind, class: "Api::V3::MapInd" do
    association :map_attribute, factory: :api_v3_map_attribute
    association :ind, factory: :api_v3_ind
  end
end
