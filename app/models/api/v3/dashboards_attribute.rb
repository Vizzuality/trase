# == Schema Information
#
# Table name: dashboards_attributes
#
#  id                            :integer          not null, primary key
#  dashboards_attribute_group_id :integer          not null
#  position                      :integer          not null
#  chart_type                    :string           not null
#  created_at                    :datetime         not null
#  updated_at                    :datetime         not null
#
# Indexes
#
#  dashboards_attributes_dashboards_attribute_group_id_position_ke  (dashboards_attribute_group_id,position) UNIQUE
#  index_dashboards_attributes_on_dashboards_attribute_group_id     (dashboards_attribute_group_id)
#
# Foreign Keys
#
#  fk_rails_...  (dashboards_attribute_group_id => dashboards_attribute_groups.id) ON DELETE => cascade
#

module Api
  module V3
    class DashboardsAttribute < YellowTable
      include Api::V3::AssociatedAttributes

      belongs_to :dashboards_attribute_group
      has_one :dashboards_ind, autosave: true
      has_one :dashboards_qual, autosave: true
      has_one :dashboards_quant, autosave: true

      validates :dashboards_attribute_group, presence: true
      validates :position,
                presence: true,
                uniqueness: {scope: :dashboards_attribute_group}
      validates_with OneAssociatedAttributeValidator,
                     attributes: [:dashboards_ind, :dashboards_qual, :dashboards_quant]
      validates_with AttributeAssociatedOnceValidator,
                     attribute: :dashboards_ind,
                     scope: :dashboards_attribute_group,
                     if: :new_dashboards_ind_given?
      validates_with AttributeAssociatedOnceValidator,
                     attribute: :dashboards_qual,
                     scope: :dashboards_attribute_group,
                     if: :new_dashboards_qual_given?
      validates_with AttributeAssociatedOnceValidator,
                     attribute: :dashboards_quant,
                     scope: :dashboards_attribute_group,
                     if: :new_dashboards_quant_given?

      after_commit :refresh_dependencies

      manage_associated_attributes [:dashboards_ind, :dashboards_qual, :dashboards_quant]

      def self.yellow_foreign_keys
        [
          {name: :dashboards_attribute_group_id, table_class: Api::V3::DashboardsAttributeGroup}
        ]
      end

      def refresh_dependencies
        # TODO: mview
      end
    end
  end
end
