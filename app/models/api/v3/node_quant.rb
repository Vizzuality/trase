module Api
  module V3
    class NodeQuant < BaseModel
      belongs_to :quant
      belongs_to :node

      def self.import_key
        [
          {name: :node_id, sql_type: 'INT'},
          {name: :quant_id, sql_type: 'INT'}
        ]
      end

      def self.unstable_foreign_keys
        [
          {name: :node_id, table_class: Api::V3::Node},
          {name: :quant_id, table_class: Api::V3::Quant}
        ]
      end
    end
  end
end
