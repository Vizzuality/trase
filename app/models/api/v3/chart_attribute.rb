module Api
  module V3
    class ChartAttribute < BaseModel
      include Api::V3::Import::YellowTableHelpers

      def self.yellow_foreign_keys
        [
          {name: :chart_id, table_class: Api::V3::Chart}
        ]
      end
    end
  end
end
