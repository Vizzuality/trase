module Api
  module V3
    class NodeInd < BlueTable
      belongs_to :ind
      belongs_to :node

      def self.import_key
        [
          {name: :node_id, sql_type: 'INT'},
          {name: :ind_id, sql_type: 'INT'}
        ]
      end

      def self.blue_foreign_keys
        [
          {name: :node_id, table_class: Api::V3::Node},
          {name: :ind_id, table_class: Api::V3::Ind}
        ]
      end
    end
  end
end
