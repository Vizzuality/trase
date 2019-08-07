FactoryBot.define do
  factory :api_v3_context_node_type_property, class: 'Api::V3::ContextNodeTypeProperty' do
    association :context_node_type, factory: :api_v3_context_node_type
    column_group { 0 }
    role { 'source' }
    is_default { false }
    is_geo_column { true }
    is_choropleth_disabled { false }
    sequence(:prefix) { |n| "prefix#{n}" }
  end
end
