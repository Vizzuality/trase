# == Schema Information
#
# Table name: dashboards_inds
#
#  id                      :bigint(8)        not null, primary key
#  dashboards_attribute_id :bigint(8)        not null
#  ind_id                  :bigint(8)        not null
#
# Indexes
#
#  dashboards_inds_dashboards_attribute_id_ind_id_key  (dashboards_attribute_id,ind_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (dashboards_attribute_id => dashboards_attributes.id) ON DELETE => cascade
#  fk_rails_...  (ind_id => inds.id) ON DELETE => cascade
#
module Api
  module V3
    class DashboardsInd < YellowTable
      belongs_to :dashboards_attribute
      belongs_to :ind

      def self.yellow_foreign_keys
        [
          {name: :dashboards_attribute_id, table_class: Api::V3::DashboardsAttribute}
        ]
      end

      def self.blue_foreign_keys
        [
          {name: :ind_id, table_class: Api::V3::Ind}
        ]
      end
    end
  end
end
