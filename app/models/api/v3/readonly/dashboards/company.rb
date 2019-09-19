# == Schema Information
#
# Table name: dashboards_companies_mv
#
#  id(id of company node (not unique))                              :integer          primary key
#  name                                                             :text
#  name_tsvector                                                    :tsvector
#  node_type_id                                                     :integer
#  node_type                                                        :text
#  profile                                                          :text
#  country_id(id of country sourcing commodity traded by this node) :integer
#  commodity_id(id of commodity traded by this node)                :integer
#  node_id(id of another node from the same supply chain)           :integer
#
# Indexes
#
#  dashboards_companies_mv_commodity_id_idx   (commodity_id)
#  dashboards_companies_mv_country_id_idx     (country_id)
#  dashboards_companies_mv_group_columns_idx  (id,name,node_type)
#  dashboards_companies_mv_name_idx           (name)
#  dashboards_companies_mv_name_tsvector_idx  (name_tsvector) USING gin
#  dashboards_companies_mv_node_id_idx        (node_id)
#  dashboards_companies_mv_node_type_id_idx   (node_type_id)
#  dashboards_companies_mv_unique_idx         (id,node_id,country_id,commodity_id) UNIQUE
#

module Api
  module V3
    module Readonly
      module Dashboards
        class Company < Api::V3::Readonly::BaseModel
          self.table_name = 'dashboards_companies_mv'
          belongs_to :node
        end
      end
    end
  end
end
