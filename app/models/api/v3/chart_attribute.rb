# == Schema Information
#
# Table name: chart_attributes
#
#  id            :integer          not null, primary key
#  chart_id      :integer          not null
#  position      :integer
#  years         :integer          is an Array
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  display_name  :text
#  legend_name   :text
#  display_type  :text
#  display_style :text
#  state_average :boolean          default(FALSE), not null
#  identifier    :text
#
# Indexes
#
#  chart_attributes_chart_id_identifier_key  (chart_id,identifier) UNIQUE
#  chart_attributes_chart_id_position_key    (chart_id,position) UNIQUE WHERE (identifier IS NULL)
#  index_chart_attributes_on_chart_id        (chart_id)
#
# Foreign Keys
#
#  fk_rails_...  (chart_id => charts.id) ON DELETE => cascade
#

module Api
  module V3
    class ChartAttribute < YellowTable
      include Api::V3::StringyArray
      include Api::V3::AssociatedAttributes

      belongs_to :chart, optional: false
      has_one :chart_ind, autosave: true
      has_one :chart_qual, autosave: true
      has_one :chart_quant, autosave: true

      validates :position,
                presence: true,
                uniqueness: {scope: :chart},
                if: proc { |chart_attr| chart_attr.identifier.blank? }
      validates :identifier,
                presence: true,
                uniqueness: {scope: :chart},
                if: proc { |chart_attr| chart_attr.position.blank? }
      validates_with OneAssociatedAttributeValidator,
                     attributes: [:chart_ind, :chart_qual, :chart_quant]
      validates_with AttributeAssociatedOnceValidator,
                     attribute: :chart_ind, scope: [:chart_id, :state_average],
                     if: :new_chart_ind_given?
      validates_with AttributeAssociatedOnceValidator,
                     attribute: :chart_qual, scope: [:chart_id, :state_average],
                     if: :new_chart_qual_given?
      validates_with AttributeAssociatedOnceValidator,
                     attribute: :chart_quant, scope: [:chart_id, :state_average],
                     if: :new_chart_quant_given?

      before_save :nullify_empty_identifier
      after_commit :refresh_dependencies

      stringy_array :years
      manage_associated_attributes [:chart_ind, :chart_qual, :chart_quant]

      def self.yellow_foreign_keys
        [
          {name: :chart_id, table_class: Api::V3::Chart}
        ]
      end

      def refresh_dependencies
        Api::V3::Readonly::ChartAttribute.refresh
      end

      private_class_method def self.active_ids
        Api::V3::ChartInd.distinct.pluck(:chart_attribute_id) +
          Api::V3::ChartQual.distinct.pluck(:chart_attribute_id) +
          Api::V3::ChartQuant.distinct.pluck(:chart_attribute_id)
      end

      private

      def nullify_empty_identifier
        self.identifier = nil if identifier.blank?
      end
    end
  end
end
