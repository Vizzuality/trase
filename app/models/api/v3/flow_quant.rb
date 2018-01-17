module Api
  module V3
    class FlowQuant < BaseModel
      belongs_to :flow
      belongs_to :quant

      def self.import_key
        [
          {name: :flow_id, sql_type: 'INT'},
          {name: :quant_id, sql_type: 'INT'}
        ]
      end

      def self.unstable_foreign_keys
        [
          {name: :quant_id, table_class: Api::V3::Quant}
        ]
      end
    end
  end
end
