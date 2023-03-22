FactoryBot.define do
  factory :api_v3_download_attribute, class: "Api::V3::DownloadAttribute" do
    association :context, factory: :api_v3_context
    sequence(:position) { |n| n }
    sequence(:display_name) { |n| "attribute #{n}" }
  end
end
