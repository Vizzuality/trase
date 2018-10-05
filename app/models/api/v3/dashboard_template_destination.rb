# == Schema Information
#
# Table name: dashboard_template_destinations
#
#  id                    :integer          not null, primary key
#  dashboard_template_id :integer
#  node_id               :integer
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#

module Api
  module V3
    class DashboardTemplateDestination < YellowTable
      belongs_to :dashboard_template
      belongs_to :node
    end
  end
end
