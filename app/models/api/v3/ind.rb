module Api
  module V3
    class Ind < BaseModel
      include Api::V3::Import::BlueTableHelpers

      has_one :ind_property
      delegate :display_name, to: :ind_property

      def self.import_key
        [
          {name: :name, sql_type: 'TEXT'}
        ]
      end
    end
  end
end
