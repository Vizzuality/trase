# == Schema Information
#
# Table name: dashboards_countries_mv
#
#  id(id of sourcing country (not unique))                                        :integer          primary key
#  commodity_id(id of commodity sourced from this country)                        :integer
#  node_id(id of node, through which this commodity is sourced from this country) :integer
#  iso2                                                                           :text
#  name                                                                           :text
#  name_tsvector                                                                  :tsvector
#  profile                                                                        :text
#
# Indexes
#
#  dashboards_countries_mv_commodity_id_idx   (commodity_id)
#  dashboards_countries_mv_group_columns_idx  (id,name)
#  dashboards_countries_mv_name_idx           (name)
#  dashboards_countries_mv_name_tsvector_idx  (name_tsvector) USING gin
#  dashboards_countries_mv_node_id_idx        (node_id)
#  dashboards_countries_mv_unique_idx         (id,node_id,commodity_id) UNIQUE
#

module Api
  module V3
    module Readonly
      module Dashboards
        class Country < Api::V3::Readonly::BaseModel
          self.table_name = 'dashboards_countries_mv'
          belongs_to :country
        end
      end
    end
  end
end
