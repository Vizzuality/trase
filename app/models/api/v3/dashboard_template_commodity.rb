# == Schema Information
#
# Table name: dashboard_template_commodities
#
#  id                    :integer          not null, primary key
#  dashboard_template_id :integer
#  commodity_id          :integer
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#

module Api
  module V3
    class DashboardTemplateCommodity < YellowTable
      belongs_to :dashboard_template
      belongs_to :commodity
    end
  end
end
