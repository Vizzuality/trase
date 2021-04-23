FactoryBot.define do
  factory :api_v3_ind_property, class: 'Api::V3::IndProperty' do
    association :ind, factory: :api_v3_ind
    sequence(:display_name) { |n| "attribute #{n}" }
    unit_type { 'currency' }
    aggregation_method { 'AVG' }
  end
end
