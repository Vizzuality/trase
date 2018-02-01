module Api
  module V3
    class ResizeByAttribute < YellowTable
      include Api::V3::StringyArray
      include Api::V3::AssociatedAttributes

      belongs_to :context
      has_one :resize_by_quant, autosave: true

      validates :context, presence: true
      validates :group_number, presence: true
      validates :position, presence: true, uniqueness: {scope: [:context, :group_number]}
      validates :is_disabled, inclusion: { in: [true, false] }
      validates :is_default, inclusion: { in: [true, false] }
      validates_with OneAssociatedAttributeValidator, {
        attributes: [:resize_by_quant]
      }
      validates_with AttributeAssociatedOnceValidator,
        attribute: :resize_by_quant, if: :new_resize_by_quant_given?

      stringy_array :years
      manage_associated_attributes [:resize_by_quant]

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end
    end
  end
end
