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

module Api
  module V3
    class NodeProperty < YellowTable
      belongs_to :node

      def self.blue_foreign_keys
        [
          {name: :node_id, table_class: Api::V3::Node}
        ]
      end
    end
  end
end
