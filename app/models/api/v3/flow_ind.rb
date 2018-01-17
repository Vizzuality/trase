module Api
  module V3
    class FlowInd < BaseModel
      belongs_to :flow
      belongs_to :ind

      def self.import_key
        [
          {name: :flow_id, sql_type: 'INT'},
          {name: :ind_id, sql_type: 'INT'}
        ]
      end

      def self.unstable_foreign_keys
        [
          {name: :ind_id, table_class: Api::V3::Ind}
        ]
      end
    end
  end
end
