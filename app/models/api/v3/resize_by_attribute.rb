module Api
  module V3
    class ResizeByAttribute < BaseModel
      belongs_to :context
      has_many :resize_by_quants

      def self.unstable_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end
    end
  end
end
