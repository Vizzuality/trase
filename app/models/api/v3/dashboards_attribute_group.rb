# == Schema Information
#
# Table name: dashboards_attribute_groups
#
#  id         :integer          not null, primary key
#  name       :text             not null
#  position   :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  dashboards_attribute_groups_position_key  (position) UNIQUE
#

module Api
  module V3
    class DashboardsAttributeGroup < YellowTable
      has_many :dashboards_attributes

      validates :name, presence: true
      validates :position, presence: true, uniqueness: true

      after_commit :refresh_dependencies

      def self.select_options
        Api::V3::DashboardsAttributeGroup.all.map(&:name)
      end

      def refresh_dependencies
        Api::V3::Readonly::DashboardsAttribute.refresh
      end
    end
  end
end
