# == Schema Information
#
# Table name: resize_by_attributes
#
#  id                                                                                                   :integer          not null, primary key
#  context_id                                                                                           :integer          not null
#  group_number(Group number)                                                                           :integer          default(1), not null
#  position(Display order in scope of context and group number)                                         :integer          not null
#  tooltip_text(Tooltip text)                                                                           :text
#  years(Array of years for which to show this attribute in scope of chart; empty (NULL) for all years) :integer          is an Array
#  is_disabled(When set, this attribute is not displayed)                                               :boolean          default(FALSE), not null
#  is_default(When set, show this attribute by default)                                                 :boolean          default(FALSE), not null
#  is_quick_fact                                                                                        :boolean          default(FALSE), not null
#
# Indexes
#
#  resize_by_attributes_context_id_idx  (context_id)
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
      include Api::V3::EnsureGroupNumberPresent
      include Api::V3::IsDownloadable

      belongs_to :context
      has_one :resize_by_quant, autosave: true

      validates :context, presence: true
      validates :group_number, presence: true
      validates :is_disabled, inclusion: {in: [true, false]}
      validates :is_default, inclusion: {in: [true, false]}
      validates_with OneAssociatedAttributeValidator,
                     attributes: [:resize_by_quant]
      validates_with AttributeAssociatedOnceValidator,
                     attribute: :resize_by_quant,
                     if: :new_resize_by_quant_given?
      validate :at_most_two_quick_facts_per_context

      after_create :set_years
      after_commit :refresh_dependents

      stringy_array :years
      manage_associated_attributes [:resize_by_quant]
      acts_as_list scope: [:context_id, :group_number]

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end

      private

      def refresh_dependents
        Api::V3::Readonly::ResizeByAttribute.refresh(skip_dependencies: true)
      end

      def set_years
        FlowAttributeAvailableYearsUpdateWorker.perform_async(
          self.class.name, id, context_id
        )
      end

      def at_most_two_quick_facts_per_context
        return false unless context

        current_quick_facts = context.resize_by_attributes.
          where(is_quick_fact: true).
          where.not(id: id)

        return if current_quick_facts.length <= 1

        errors.add(
          :is_quick_fact,
          "can't have more than two indicators set up as quick facts"
        )
      end

      private_class_method def self.active_ids
        Api::V3::ResizeByQuant.distinct.pluck(:resize_by_attribute_id)
      end
    end
  end
end
