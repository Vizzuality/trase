module Api
  module V3
    class NodeProperty < BaseModel
      include Api::V3::Import::YellowTableHelpers

      belongs_to :node

      def self.blue_foreign_keys
        [
          {name: :node_id, table_class: Api::V3::Node}
        ]
      end
    end
  end
end
