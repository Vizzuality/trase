# == Schema Information
#
# Table name: dashboards_commodities_mv
#
#  id(id of commodity (not unique))                                               :integer          primary key
#  country_id(id of country, from which this commodity is sourced)                :integer
#  node_id(id of node, through which this commodity is sourced from this country) :integer
#  name                                                                           :text
#  name_tsvector                                                                  :tsvector
#  profile                                                                        :text
#
# Indexes
#
#  dashboards_commodities_mv_country_id_idx     (country_id)
#  dashboards_commodities_mv_group_columns_idx  (id,name)
#  dashboards_commodities_mv_name_idx           (name)
#  dashboards_commodities_mv_name_tsvector_idx  (name_tsvector) USING gin
#  dashboards_commodities_mv_node_id_idx        (node_id)
#  dashboards_commodities_mv_unique_idx         (id,node_id,country_id) UNIQUE
#

module Api
  module V3
    module Readonly
      module Dashboards
        class Commodity < Api::V3::Readonly::BaseModel
          self.table_name = 'dashboards_commodities_mv'
          belongs_to :commodity
        end
      end
    end
  end
end
