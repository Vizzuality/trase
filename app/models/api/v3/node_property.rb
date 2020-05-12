# == Schema Information
#
# Table name: node_properties
#
#  id                                                       :integer          not null, primary key
#  node_id                                                  :integer          not null
#  is_domestic_consumption(When set, assume domestic trade) :boolean          default(FALSE), not null
#
# Indexes
#
#  node_properties_node_id_idx  (node_id)
#  node_properties_node_id_key  (node_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (node_id => nodes.id) ON DELETE => cascade
#
module Api
  module V3
    class NodeProperty < YellowTable
      belongs_to :node

      validates :node, presence: true, uniqueness: true

      def self.blue_foreign_keys
        [
          {name: :node_id, table_class: Api::V3::Node}
        ]
      end

      def self.insert_missing_node_properties
        sql = <<-SQL
          WITH node_ids_without_property AS (
            SELECT nodes.id AS node_id FROM nodes
            LEFT JOIN node_properties ON node_properties.node_id = nodes.id
            WHERE node_properties.id IS NULL
          )
          INSERT INTO node_properties(node_id, is_domestic_consumption, created_at, updated_at)
          SELECT node_id, FALSE, NOW(), NOW()
          FROM node_ids_without_property
        SQL
        connection.execute sql
      end
    end
  end
end
