module Api
  module V3
    class QuantProperty < BaseModel
      include AttributePropertiesProfileScopes
      include Api::V3::Import::YellowTableHelpers

      belongs_to :quant

      def self.blue_foreign_keys
        [
          {name: :quant_id, table_class: Api::V3::Quant}
        ]
      end
    end
  end
end
