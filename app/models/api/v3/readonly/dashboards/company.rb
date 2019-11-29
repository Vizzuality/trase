# == Schema Information
#
# Table name: dashboards_companies_mv
#
#  id(id of company node (not unique))                              :integer          primary key
#  node_type_id                                                     :integer
#  country_id(id of country sourcing commodity traded by this node) :integer
#  commodity_id(id of commodity traded by this node)                :integer
#  node_id(id of another node from the same supply chain)           :integer
#  name                                                             :text
#  name_tsvector                                                    :tsvector
#  node_type                                                        :text
#  profile                                                          :text
#
# Indexes
#
#  dashboards_companies_mv_commodity_id_idx   (commodity_id)
#  dashboards_companies_mv_country_id_idx     (country_id)
#  dashboards_companies_mv_name_tsvector_idx  (name_tsvector) USING gin
#  dashboards_companies_mv_node_id_idx        (node_id)
#  dashboards_companies_mv_node_type_id_idx   (node_type_id)
#  dashboards_companies_mv_unique_idx         (id,node_id,country_id,commodity_id) UNIQUE
#

# @deprecated Use {Api::V3::Readonly::Dashboards::Exporter} or
# {Api::V3::Readonly::Dashboards::Importer} instead.
# TODO: remove once dashboards_companies_mv retired
module Api
  module V3
    module Readonly
      module Dashboards
        class Company < Api::Readonly::BaseModel
          include Api::V3::Readonly::MaterialisedTable

          self.table_name = 'dashboards_companies'
          belongs_to :node

          class << self
            def refresh_dependencies(options = {})
              Api::V3::Readonly::NodesPerContextRankedByVolumePerYear.refresh(
                options.merge(skip_dependents: true)
              )
            end
          end

          INDEXES = [
            {columns: :commodity_id},
            {columns: :country_id},
            {columns: :name_tsvector, using: :gin},
            {columns: :node_type_id}
          ].freeze
        end
      end
    end
  end
end
