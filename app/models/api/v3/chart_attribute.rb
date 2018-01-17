module Api
  module V3
    class ChartAttribute < BaseModel
      def self.stable_foreign_keys
        [
          {name: :chart_id, table_class: Api::V3::Chart}
        ]
      end
    end
  end
end
