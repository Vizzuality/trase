module Api
  module V3
    class NodeProperty < BaseModel
      belongs_to :node

      def self.unstable_foreign_keys
        [
          {name: :node_id, table_class: Api::V3::Node}
        ]
      end
    end
  end
end
