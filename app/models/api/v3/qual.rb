module Api
  module V3
    class Qual < BaseModel
      include Api::V3::Import::BlueTableHelpers

      has_one :qual_property
      delegate :display_name, to: :qual_property

      def self.import_key
        [
          {name: :name, sql_type: 'TEXT'}
        ]
      end
    end
  end
end
