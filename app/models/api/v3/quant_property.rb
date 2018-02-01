module Api
  module V3
    class QuantProperty < YellowTable
      include AttributePropertiesProfileScopes

      belongs_to :quant

      def self.blue_foreign_keys
        [
          {name: :quant_id, table_class: Api::V3::Quant}
        ]
      end
    end
  end
end
