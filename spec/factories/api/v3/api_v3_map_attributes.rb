FactoryBot.define do
  factory :api_v3_map_attribute, class: 'Api::V3::MapAttribute' do
    association :map_attribute_group, factory: :api_v3_map_attribute_group
    sequence(:position) { |n| n }
    bucket_3 [33,66]
    bucket_5 [20,40,60,80]
    is_disabled false
    is_default false
  end
end
