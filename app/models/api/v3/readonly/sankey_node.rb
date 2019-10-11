# == Schema Information
#
# Table name: sankey_nodes_mv
#
#  id                      :integer          primary key
#  main_id                 :integer
#  name                    :text
#  geo_id                  :text
#  source_country_iso2     :text
#  is_domestic_consumption :boolean
#  is_unknown              :boolean
#  node_type_id            :integer
#  node_type               :text
#  profile_type            :text
#  has_flows               :boolean
#  is_aggregated           :boolean
#  context_id              :integer
#
# Indexes
#
#  sankey_nodes_mv_context_id_id_idx  (context_id,id) UNIQUE
#  sankey_nodes_mv_node_type_id_idx   (node_type_id)
#

module Api
  module V3
    module Readonly
      class SankeyNode < Api::Readonly::BaseModel
        self.table_name = 'sankey_nodes_mv'
      end
    end
  end
end
