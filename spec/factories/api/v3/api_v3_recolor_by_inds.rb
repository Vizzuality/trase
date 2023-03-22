FactoryBot.define do
  factory :api_v3_recolor_by_ind, class: "Api::V3::RecolorByInd" do
    association :recolor_by_attribute, factory: :api_v3_recolor_by_attribute
    association :ind, factory: :api_v3_ind
  end
end
