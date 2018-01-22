module Api
  module V3
    class ChartQual < YellowTable
      def self.yellow_foreign_keys
        [
          {name: :chart_attribute_id, table_class: Api::V3::Chart}
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
