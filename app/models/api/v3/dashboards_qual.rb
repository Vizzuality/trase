# == Schema Information
#
# Table name: dashboards_quals
#
#  id                      :bigint(8)        not null, primary key
#  dashboards_attribute_id :bigint(8)        not null
#  qual_id                 :bigint(8)        not null
#
# Indexes
#
#  dashboards_quals_dashboards_attribute_id_qual_id_key  (dashboards_attribute_id,qual_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (dashboards_attribute_id => dashboards_attributes.id) ON DELETE => cascade
#  fk_rails_...  (qual_id => quals.id) ON DELETE => cascade
#
module Api
  module V3
    class DashboardsQual < YellowTable
      belongs_to :dashboards_attribute
      belongs_to :qual

      def self.yellow_foreign_keys
        [
          {name: :dashboards_attribute_id, table_class: Api::V3::DashboardsAttribute}
        ]
      end

      def self.blue_foreign_keys
        [
          {name: :qual_id, table_class: Api::V3::Qual}
        ]
      end
    end
  end
end
