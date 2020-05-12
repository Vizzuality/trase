# == Schema Information
#
# Table name: dashboards_quants
#
#  id                      :bigint(8)        not null, primary key
#  dashboards_attribute_id :bigint(8)        not null
#  quant_id                :bigint(8)        not null
#
# Indexes
#
#  dashboards_quants_dashboards_attribute_id_quant_id_key  (dashboards_attribute_id,quant_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (dashboards_attribute_id => dashboards_attributes.id) ON DELETE => cascade
#  fk_rails_...  (quant_id => quants.id) ON DELETE => cascade
#
module Api
  module V3
    class DashboardsQuant < YellowTable
      belongs_to :dashboards_attribute
      belongs_to :quant

      def self.yellow_foreign_keys
        [
          {name: :dashboards_attribute_id, table_class: Api::V3::DashboardsAttribute}
        ]
      end

      def self.blue_foreign_keys
        [
          {name: :quant_id, table_class: Api::V3::Quant}
        ]
      end
    end
  end
end
