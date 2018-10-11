# == Schema Information
#
# Table name: node_properties
#
#  id                      :integer          not null, primary key
#  node_id                 :integer          not null
#  is_domestic_consumption :boolean          default(FALSE), not null
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#
# Indexes
#
#  index_node_properties_on_node_id  (node_id)
#  node_properties_node_id_key       (node_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (node_id => nodes.id) ON DELETE => cascade
#

FactoryBot.define do
  factory :api_v3_node_property, class: 'Api::V3::NodeProperty' do
    association :node, factory: :api_v3_node
  end
end
