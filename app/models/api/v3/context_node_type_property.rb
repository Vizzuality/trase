module Api
  module V3
    class ContextNodeTypeProperty < BaseModel
      belongs_to :context_node_type

      def self.unstable_foreign_keys
        [
          {name: :context_node_type_id, table_class: Api::V3::ContextNodeType}
        ]
      end
    end
  end
end
