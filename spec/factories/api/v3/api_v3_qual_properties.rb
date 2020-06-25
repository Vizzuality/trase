FactoryBot.define do
  factory :api_v3_qual_property, class: 'Api::V3::QualProperty' do
    association :qual, factory: :api_v3_qual
    sequence(:display_name) { |n| "attribute #{n}" }
  end
end
