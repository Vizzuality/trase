# == Schema Information
#
# Table name: dashboards_sources
#
#  id(id of source node (not unique))                                 :integer          not null, primary key
#  node_type_id                                                       :integer
#  context_id                                                         :integer
#  country_id(id of country sourcing commodity coming from this node) :integer          not null
#  commodity_id(id of commodity coming from this node)                :integer          not null
#  context_node_type_id                                               :integer
#  year                                                               :integer          not null
#  name                                                               :text
#  name_tsvector                                                      :tsvector
#  node_type                                                          :text
#  profile                                                            :text
#  rank_by_year                                                       :jsonb
#
# Indexes
#
#  dashboards_sources_commodity_id_idx   (commodity_id)
#  dashboards_sources_country_id_idx     (country_id)
#  dashboards_sources_name_tsvector_idx  (name_tsvector)
#  dashboards_sources_node_type_id_idx   (node_type_id)
#
module Api
  module V3
    module Readonly
      module Dashboards
        class Source < Api::Readonly::BaseModel
          include Api::V3::Readonly::MaterialisedTable

          self.table_name = 'dashboards_sources'
          belongs_to :node

          INDEXES = [
            {columns: :commodity_id},
            {columns: :country_id},
            {columns: :name_tsvector, using: :gin},
            {columns: :node_type_id}
          ].freeze

          def self.key_translations
            {
              node_id: -> (key_value) {
                {id: key_value}
              },
              geometry_context_node_type_id: -> (key_value) {
                {}
              }
            }
          end
        end
      end
    end
  end
end
