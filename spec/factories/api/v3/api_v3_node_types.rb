FactoryBot.define do
  factory :api_v3_node_type, class: "Api::V3::NodeType" do
    name { NodeTypeName.list.sample }
    initialize_with { Api::V3::NodeType.find_or_create_by(name: name) }
  end
end
