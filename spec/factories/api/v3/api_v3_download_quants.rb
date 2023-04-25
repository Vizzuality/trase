FactoryBot.define do
  factory :api_v3_download_quant, class: "Api::V3::DownloadQuant" do
    association :download_attribute, factory: :api_v3_download_attribute
    association :quant, factory: :api_v3_quant
  end
end
