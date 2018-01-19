module Api
  module V3
    class FlowQual < BaseModel
      include Api::V3::Import::BlueTableHelpers

      belongs_to :flow
      belongs_to :qual

      def self.import_key
        [
          {name: :flow_id, sql_type: 'INT'},
          {name: :qual_id, sql_type: 'INT'}
        ]
      end

      def self.blue_foreign_keys
        [
          {name: :qual_id, table_class: Api::V3::Qual}
        ]
      end
    end
  end
end
