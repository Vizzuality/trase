# == Schema Information
#
# Table name: recolor_by_attributes
#
#  id                 :integer          not null, primary key
#  context_id         :integer          not null
#  group_number       :integer          default(1), not null
#  position           :integer          not null
#  legend_type        :text             not null
#  legend_color_theme :text             not null
#  interval_count     :integer
#  min_value          :text
#  max_value          :text
#  divisor            :float
#  tooltip_text       :text
#  years              :integer          is an Array
#  is_disabled        :boolean          default(FALSE), not null
#  is_default         :boolean          default(FALSE), not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#
# Indexes
#
#  index_recolor_by_attributes_on_context_id                   (context_id)
#  recolor_by_attributes_context_id_group_number_position_key  (context_id,group_number,position) UNIQUE
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

      validates :context, presence: true
      validates :group_number, presence: true
      validates :position,
                presence: true,
                uniqueness: {scope: [:context, :group_number]}
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
                unless: proc { |a| a.legend_type != 'percentual' }
      validates_with OneAssociatedAttributeValidator,
                     attributes: [:recolor_by_ind, :recolor_by_qual]
      validates_with AttributeAssociatedOnceValidator,
                     attribute: :recolor_by_ind,
                     if: :new_recolor_by_ind_given?
      validates_with AttributeAssociatedOnceValidator,
                     attribute: :recolor_by_qual,
                     if: :new_recolor_by_qual_given?

      after_commit :refresh_dependents

      stringy_array :years
      manage_associated_attributes [:recolor_by_ind, :recolor_by_qual]

      def self.blue_foreign_keys
        [
          {name: :context_id, table_class: Api::V3::Context}
        ]
      end

      def refresh_dependents
        Api::V3::Readonly::RecolorByAttribute.refresh
      end
    end
  end
end
