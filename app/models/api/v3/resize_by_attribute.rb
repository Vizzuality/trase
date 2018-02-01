module Api
  module V3
    class ResizeByAttribute < YellowTable
      belongs_to :context
      has_many :resize_by_quants

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end
    end
  end
end
