module Api
  module V3
    class ContextNodeTypeProperty < YellowTable
      belongs_to :context_node_type

      def self.blue_foreign_keys
        [
          {name: :context_node_type_id, table_class: Api::V3::ContextNodeType}
        ]
      end
    end
  end
end
