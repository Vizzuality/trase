# == Schema Information
#
# Table name: dashboards_commodities
#
#  id(id of commodity (not unique))                                               :integer          not null, primary key
#  country_id(id of country, from which this commodity is sourced)                :integer          not null
#  node_id(id of node, through which this commodity is sourced from this country) :integer          not null
#  name                                                                           :text
#  name_tsvector                                                                  :tsvector
#  profile                                                                        :text
#
# Indexes
#
#  dashboards_commodities_country_id_idx     (country_id)
#  dashboards_commodities_name_tsvector_idx  (name_tsvector)
#  dashboards_commodities_node_id_idx        (node_id)
#

module Api
  module V3
    module Readonly
      module Dashboards
        class Commodity < Api::Readonly::BaseModel
          include Api::V3::Readonly::MaterialisedTable

          self.table_name = 'dashboards_commodities'
          belongs_to :commodity

          INDEXES = [
            {columns: :country_id},
            {columns: :node_id},
            {columns: :name_tsvector, using: :gin}
          ].freeze
        end
      end
    end
  end
end
