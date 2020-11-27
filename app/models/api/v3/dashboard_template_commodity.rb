# == Schema Information
#
# Table name: dashboard_template_commodities
#
#  id                    :bigint(8)        not null, primary key
#  dashboard_template_id :integer
#  commodity_id          :integer
#
module Api
  module V3
    class DashboardTemplateCommodity < YellowTable
      belongs_to :dashboard_template
      belongs_to :commodity

      def self.blue_foreign_keys
        [
          {name: :commodity_id, table_class: Api::V3::Commodity}
        ]
      end
    end
  end
end
