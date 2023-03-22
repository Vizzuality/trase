FactoryBot.define do
  factory :api_v3_context_node_type_property, class: "Api::V3::ContextNodeTypeProperty" do
    association :context_node_type, factory: :api_v3_context_node_type
    column_group { Api::V3::ContextNodeTypeProperty::COLUMN_GROUP.sample }
    role do |cnt_prop|
      Api::V3::ContextNodeTypeProperty::DEFAULT_ROLES[cnt_prop.column_group]
    end
    prefix do |cnt_prop|
      Api::V3::ContextNodeTypeProperty::DEFAULT_PREFIXES[cnt_prop.column_group]
    end
    is_default { false }
    is_visible { true }
    is_geo_column { true }
    is_choropleth_disabled { false }
  end
end
