# == Schema Information
#
# Table name: dashboards_importers_mv
#
#  id            :integer          primary key
#  node_type_id  :integer
#  country_id    :integer
#  commodity_id  :integer
#  node_id       :integer
#  name          :text
#  name_tsvector :tsvector
#  node_type     :text
#  profile       :text
#
# Indexes
#
#  dashboards_importers_mv_commodity_id_idx   (commodity_id)
#  dashboards_importers_mv_country_id_idx     (country_id)
#  dashboards_importers_mv_name_tsvector_idx  (name_tsvector) USING gin
#  dashboards_importers_mv_node_id_idx        (node_id)
#  dashboards_importers_mv_node_type_id_idx   (node_type_id)
#  dashboards_importers_mv_unique_idx         (id,node_id,country_id,commodity_id) UNIQUE
#

module Api
  module V3
    module Readonly
      module Dashboards
        class Importer < Api::Readonly::BaseModel
          self.table_name = 'dashboards_importers_mv'
          belongs_to :node

          class << self
            def refresh_dependencies(options = {})
              Api::V3::Readonly::NodesPerContextRankedByVolumePerYear.refresh(
                options.merge(skip_dependents: true)
              )
            end
          end
        end
      end
    end
  end
end
