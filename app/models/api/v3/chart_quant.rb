module Api
  module V3
    class ChartQuant < BaseModel
      include Api::V3::Import::YellowTableHelpers

      def self.yellow_foreign_keys
        [
          {name: :chart_attribute_id, table_class: Api::V3::Chart}
        ]
      end

      def self.blue_foreign_keys
        [
          {name: :quant_id, table_class: Api::V3::Quant}
        ]
      end
    end
  end
end
