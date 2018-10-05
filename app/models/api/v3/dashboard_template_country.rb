# == Schema Information
#
# Table name: dashboard_template_countries
#
#  id                    :integer          not null, primary key
#  dashboard_template_id :integer
#  country_id            :integer
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#

module Api
  module V3
    class DashboardTemplateCountry < YellowTable
      belongs_to :dashboard_template
      belongs_to :country
    end
  end
end
