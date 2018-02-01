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
