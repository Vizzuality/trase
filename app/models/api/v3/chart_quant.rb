module Api
  module V3
    class ChartQuant < BaseModel
      def self.stable_foreign_keys
        [
          {name: :chart_attribute_id, table_class: Api::V3::Chart}
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
