FactoryBot.define do
  factory :api_v3_node_property, class: 'Api::V3::NodeProperty' do
    association :node, factory: :api_v3_node
  end
end
