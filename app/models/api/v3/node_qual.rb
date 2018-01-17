module Api
  module V3
    class NodeQual < BaseModel
      belongs_to :qual
      belongs_to :node

      def self.import_key
        [
          {name: :node_id, sql_type: 'INT'},
          {name: :qual_id, sql_type: 'INT'}
        ]
      end

      def self.unstable_foreign_keys
        [
          {name: :node_id, table_class: Api::V3::Node},
          {name: :qual_id, table_class: Api::V3::Qual}
        ]
      end
    end
  end
end
