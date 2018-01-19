module Api
  module V3
    class Commodity < BaseModel
      include Api::V3::Import::BlueTableHelpers

      has_many :contexts

      def self.import_key
        [
          {name: :name, sql_type: 'TEXT'}
        ]
      end
    end
  end
end
