module Api
  module V3
    class ChartInd < YellowTable
      def self.yellow_foreign_keys
        [
          {name: :chart_attribute_id, table_class: Api::V3::Chart}
        ]
      end

      def self.blue_foreign_keys
        [
          {name: :ind_id, table_class: Api::V3::Ind}
        ]
      end
    end
  end
end
