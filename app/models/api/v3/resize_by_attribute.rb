module Api
  module V3
    class ResizeByAttribute < YellowTable
      include Api::V3::StringyArray

      belongs_to :context
      has_many :resize_by_quants

      validates :context, presence: true
      validates :group_number, presence: true
      validates :position, presence: true, uniqueness: {scope: [:context, :group_number]}
      validates :is_disabled, inclusion: { in: [true, false] }
      validates :is_default, inclusion: { in: [true, false] }

      stringy_array :years

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end
    end
  end
end
