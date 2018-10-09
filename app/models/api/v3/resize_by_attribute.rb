# == Schema Information
#
# Table name: resize_by_attributes
#
#  id           :integer          not null, primary key
#  context_id   :integer          not null
#  group_number :integer          default(1), not null
#  position     :integer          not null
#  tooltip_text :text
#  years        :integer          is an Array
#  is_disabled  :boolean          default(FALSE), not null
#  is_default   :boolean          default(FALSE), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_resize_by_attributes_on_context_id                   (context_id)
#  resize_by_attributes_context_id_group_number_position_key  (context_id,group_number,position) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (context_id => contexts.id) ON DELETE => cascade
#

module Api
  module V3
    class ResizeByAttribute < YellowTable
      include Api::V3::StringyArray
      include Api::V3::AssociatedAttributes

      belongs_to :context
      has_one :resize_by_quant, autosave: true

      validates :context, presence: true
      validates :group_number, presence: true
      validates :position,
                presence: true,
                uniqueness: {scope: [:context, :group_number]}
      validates :is_disabled, inclusion: {in: [true, false]}
      validates :is_default, inclusion: {in: [true, false]}
      validates_with OneAssociatedAttributeValidator,
                     attributes: [:resize_by_quant]
      validates_with AttributeAssociatedOnceValidator,
                     attribute: :resize_by_quant,
                     if: :new_resize_by_quant_given?

      after_commit :refresh_dependents

      stringy_array :years
      manage_associated_attributes [:resize_by_quant]

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end

      def refresh_dependents
        Api::V3::Readonly::ResizeByAttribute.refresh
      end
    end
  end
end
