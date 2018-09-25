# == Schema Information
#
# Table name: dashboards_commodities_mv
#
#  id         :integer          primary key
#  name       :text
#  country_id :integer
#  node_id    :integer
#
# Indexes
#
#  dashboards_commodities_mv_country_id_idx     (country_id)
#  dashboards_commodities_mv_group_columns_idx  (id,name)
#  dashboards_commodities_mv_node_id_idx        (node_id)
#  dashboards_commodities_mv_unique_idx         (id,node_id,country_id) UNIQUE
#

module Api
  module V3
    module Readonly
      module Dashboards
        class Commodity < Api::V3::Readonly::BaseModel
          include Refresh

          self.table_name = 'dashboards_commodities_mv'
          belongs_to :commodity
        end
      end
    end
  end
end
