FactoryBot.define do
  factory :api_v3_recolor_by_qual, class: "Api::V3::RecolorByQual" do
    association :recolor_by_attribute, factory: :api_v3_recolor_by_attribute
    association :qual, factory: :api_v3_qual
  end
end
