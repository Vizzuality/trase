module Api
  module V3
    class ContextNodeType < BaseModel
      include Api::V3::Import::BlueTableHelpers

      belongs_to :node_type
      belongs_to :context
      has_one :context_node_type_property
      has_one :profile

      def self.import_key
        [
          {name: :context_id, sql_type: 'INT'},
          {name: :node_type_id, sql_type: 'INT'}
        ]
      end

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context},
          {name: :node_type_id, table_class: Api::V3::NodeType}
        ]
      end
    end
  end
end
