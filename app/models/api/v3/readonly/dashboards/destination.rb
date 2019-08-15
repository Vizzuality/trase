# == Schema Information
#
# Table name: dashboards_destinations_mv
#
#  id            :integer          primary key
#  name          :text
#  name_tsvector :tsvector
#  node_type_id  :integer
#  node_type     :text
#  profile       :text
#  country_id    :integer
#  commodity_id  :integer
#  node_id       :integer
#
# Indexes
#
#  dashboards_destinations_mv_commodity_id_idx   (commodity_id)
#  dashboards_destinations_mv_country_id_idx     (country_id)
#  dashboards_destinations_mv_group_columns_idx  (id,name,node_type)
#  dashboards_destinations_mv_name_idx           (name)
#  dashboards_destinations_mv_name_tsvector_idx  (name_tsvector) USING gin
#  dashboards_destinations_mv_node_id_idx        (node_id)
#  dashboards_destinations_mv_node_type_id_idx   (node_type_id)
#  dashboards_destinations_mv_unique_idx         (id,node_id,country_id,commodity_id) UNIQUE
#

module Api
  module V3
    module Readonly
      module Dashboards
        class Destination < Api::V3::Readonly::BaseModel
          self.table_name = 'dashboards_destinations_mv'
          belongs_to :node
        end
      end
    end
  end
end
