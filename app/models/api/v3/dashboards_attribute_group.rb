# == Schema Information
#
# Table name: dashboards_attribute_groups
#
#  id                      :bigint(8)        not null, primary key
#  name(Name for display)  :text             not null
#  position(Display order) :integer          not null
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

      def self.select_options
        order(:name).map { |group| [group.name, group.id] }
      end
    end
  end
end
