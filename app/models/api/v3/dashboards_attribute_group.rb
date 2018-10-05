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

      after_commit :refresh_dependents

      def self.select_options
        order(:name).map { |group| [group.name, group.id] }
      end

      def refresh_dependents
        Api::V3::Readonly::DashboardsAttribute.refresh_later
      end
    end
  end
end
