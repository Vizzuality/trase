FactoryBot.define do
  factory :api_v3_resize_by_quant, class: "Api::V3::ResizeByQuant" do
    association :resize_by_attribute, factory: :api_v3_resize_by_attribute
    association :quant, factory: :api_v3_quant
  end
end
