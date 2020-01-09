# == Schema Information
#
# Table name: dashboards_destinations
#
#  id(id of destination node (not unique))                         :integer          not null, primary key
#  node_type_id                                                    :integer
#  context_id                                                      :integer
#  country_id(id of country sourcing commodity going to this node) :integer          not null
#  commodity_id(id of commodity going to this node)                :integer          not null
#  year                                                            :integer          not null
#  name                                                            :text
#  name_tsvector                                                   :tsvector
#  node_type                                                       :text
#  profile                                                         :text
#  rank_by_year                                                    :jsonb
#
# Indexes
#
#  dashboards_destinations_commodity_id_idx   (commodity_id)
#  dashboards_destinations_country_id_idx     (country_id)
#  dashboards_destinations_name_tsvector_idx  (name_tsvector)
#  dashboards_destinations_node_type_id_idx   (node_type_id)
#

module Api
  module V3
    module Readonly
      module Dashboards
        class Destination < Api::Readonly::BaseModel
          include Api::V3::Readonly::MaterialisedTable

          self.table_name = 'dashboards_destinations'
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
