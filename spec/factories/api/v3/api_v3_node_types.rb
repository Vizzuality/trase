FactoryBot.define do
  factory :api_v3_node_type, class: 'Api::V3::NodeType' do
    sequence(:name) { |n| NodeTypeName.list[n] }
  end
end
