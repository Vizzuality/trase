# == Schema Information
#
# Table name: dashboards_countries_mv
#
#  id            :integer          primary key
#  name          :text
#  name_tsvector :tsvector
#  iso2          :text
#  commodity_id  :integer
#  node_id       :integer
#
# Indexes
#
#  dashboards_countries_mv_commodity_id_idx   (commodity_id)
#  dashboards_countries_mv_group_columns_idx  (id,name)
#  dashboards_countries_mv_name_tsvector_idx  (name_tsvector) USING gin
#  dashboards_countries_mv_node_id_idx        (node_id)
#  dashboards_countries_mv_unique_idx         (id,node_id,commodity_id) UNIQUE
#

module Api
  module V3
    module Readonly
      module Dashboards
        class Country < Api::V3::Readonly::BaseModel
          include Refresh

          self.table_name = 'dashboards_countries_mv'
          belongs_to :country
        end
      end
    end
  end
end
