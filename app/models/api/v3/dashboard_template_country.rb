# == Schema Information
#
# Table name: dashboard_template_countries
#
#  id                    :bigint(8)        not null, primary key
#  dashboard_template_id :integer
#  country_id            :integer
#
module Api
  module V3
    class DashboardTemplateCountry < YellowTable
      belongs_to :dashboard_template
      belongs_to :country

      def self.blue_foreign_keys
        [
          {name: :country_id, table_class: Api::V3::Country}
        ]
      end
    end
  end
end
