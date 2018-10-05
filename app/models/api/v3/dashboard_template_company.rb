# == Schema Information
#
# Table name: dashboard_template_companies
#
#  id                    :integer          not null, primary key
#  dashboard_template_id :integer
#  node_id               :integer
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#

module Api
  module V3
    class DashboardTemplateCompany < YellowTable
      belongs_to :dashboard_template
      belongs_to :node

      belongs_to :readonly_dashboards_company, class_name: Api::V3::Readonly::Dashboards::Company, foreign_key: 'node_id'
    end
  end
end
