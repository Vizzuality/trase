# == Schema Information
#
# Table name: dashboard_template_sources
#
#  id                    :bigint(8)        not null, primary key
#  dashboard_template_id :integer
#  node_id               :integer
#
module Api
  module V3
    class DashboardTemplateSource < YellowTable
      belongs_to :dashboard_template
      belongs_to :node

      belongs_to :readonly_dashboards_source,
                 class_name: "Api::V3::Readonly::Dashboards::Source",
                 foreign_key: "node_id"

      def self.blue_foreign_keys
        [
          {name: :node_id, table_class: Api::V3::Node}
        ]
      end
    end
  end
end
