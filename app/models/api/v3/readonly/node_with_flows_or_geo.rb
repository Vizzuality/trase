# == Schema Information
#
# Table name: nodes_with_flows_or_geo
#
#  id                      :integer          not null, primary key
#  context_id              :integer          not null
#  node_type_id            :integer
#  context_node_type_id    :integer
#  main_id                 :integer
#  is_unknown              :boolean
#  is_domestic_consumption :boolean
#  is_aggregated           :boolean
#  has_flows               :boolean
#  name                    :text
#  node_type               :text
#  geo_id                  :text
#  profile                 :text
#
# Indexes
#
#  nodes_with_flows_or_geo_context_id_idx    (context_id)
#  nodes_with_flows_or_geo_node_type_id_idx  (node_type_id)
#
module Api
  module V3
    module Readonly
      class NodeWithFlowsOrGeo < Api::Readonly::BaseModel
        include Api::V3::Readonly::MaterialisedTable

        self.table_name = 'nodes_with_flows_or_geo'

        INDEXES = [
          {columns: :context_id},
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
