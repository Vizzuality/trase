FactoryBot.define do
  factory :api_v3_download_qual, class: "Api::V3::DownloadQual" do
    association :download_attribute, factory: :api_v3_download_attribute
    association :qual, factory: :api_v3_qual
  end
end
