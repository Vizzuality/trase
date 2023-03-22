# == Schema Information
#
# Table name: recolor_by_attributes
#
#  id                                                                                                    :integer          not null, primary key
#  context_id                                                                                            :integer          not null
#  group_number(Attributes are displayed grouped by their group number, with a separator between groups) :integer          default(1), not null
#  position(Display order in scope of context and group number)                                          :integer          not null
#  legend_type(Type of legend, e.g. linear)                                                              :text             not null
#  legend_color_theme(Color theme of legend, e.g. red-blue)                                              :text             not null
#  interval_count(For legends with min / max value, number of intervals of the legend)                   :integer
#  min_value(Min value for the legend)                                                                   :text
#  max_value(Max value for the legend)                                                                   :text
#  divisor(Step between intervals for percentual legends)                                                :float
#  tooltip_text(Tooltip text)                                                                            :text
#  years(Array of years for which to show this attribute in scope of chart; empty (NULL) for all years)  :integer          is an Array
#  is_disabled(When set, this attribute is not displayed)                                                :boolean          default(FALSE), not null
#  is_default(When set, show this attribute by default)                                                  :boolean          default(FALSE), not null
#
# Indexes
#
#  recolor_by_attributes_context_id_idx  (context_id)
#
# Foreign Keys
#
#  fk_rails_...  (context_id => contexts.id) ON DELETE => cascade
#
module Api
  module V3
    class RecolorByAttribute < YellowTable
      include Api::V3::StringyArray
      include Api::V3::AssociatedAttributes
      include Api::V3::EnsureGroupNumberPresent
      include Api::V3::IsDownloadable

      LEGEND_TYPE = %w(
        qual
        linear
        stars
        percentual
      ).freeze

      LEGEND_COLOR_THEME = %w(
        thematic
        green-red
        blue-green
        yellow-green
        red-blue
        yes-no
      ).freeze

      belongs_to :context
      has_one :recolor_by_ind, autosave: true
      has_one :recolor_by_qual, autosave: true
      has_one :readonly_recolor_by_attribute,
              class_name: "Api::V3::Readonly::RecolorByAttribute",
              foreign_key: :id

      validates :context, presence: true
      validates :group_number, presence: true
      validates :legend_type, presence: true, inclusion: {in: LEGEND_TYPE}
      validates :legend_color_theme,
                presence: true,
                inclusion: {in: LEGEND_COLOR_THEME}
      validates :is_disabled, inclusion: {in: [true, false]}
      validates :is_default, inclusion: {in: [true, false]}
      validates :interval_count,
                presence: true,
                unless: proc { |a| a.min_value.blank? && a.max_value.blank? }
      validates :min_value,
                presence: true,
                unless: proc { |a| a.interval_count.blank? }
      validates :max_value,
                presence: true,
                unless: proc { |a| a.interval_count.blank? }
      validates :divisor,
                presence: true,
                unless: proc { |a| a.legend_type != "percentual" }
      validates_with OneAssociatedAttributeValidator,
                     attributes: [:recolor_by_ind, :recolor_by_qual]
      validates_with AttributeAssociatedOnceValidator,
                     attribute: :recolor_by_ind,
                     if: :new_recolor_by_ind_given?
      validates_with AttributeAssociatedOnceValidator,
                     attribute: :recolor_by_qual,
                     if: :new_recolor_by_qual_given?

      after_create :set_years

      stringy_array :years
      manage_associated_attributes [:recolor_by_ind, :recolor_by_qual]
      acts_as_list scope: [:context_id, :group_number]

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end

      private

      def set_years
        FlowAttributeAvailableYearsUpdateWorker.perform_async(
          self.class.name, id, context_id
        )
      end

      private_class_method def self.active_ids
        Api::V3::RecolorByInd.distinct.pluck(:recolor_by_attribute_id) +
          Api::V3::RecolorByQual.distinct.pluck(:recolor_by_attribute_id)
      end
    end
  end
end
