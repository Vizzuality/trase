module Api
  module V3
    class QuantProperty < BaseModel
      include AttributePropertiesProfileScopes

      belongs_to :quant

      def self.unstable_foreign_keys
        [
          {name: :quant_id, table_class: Api::V3::Quant}
        ]
      end
    end
  end
end
