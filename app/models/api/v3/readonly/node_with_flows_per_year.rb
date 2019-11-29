# == Schema Information
#
# Table name: nodes_with_flows_per_year
#
#  node_id              :integer          not null
#  context_id           :integer          not null
#  country_id           :integer
#  commodity_id         :integer
#  node_type_id         :integer
#  context_node_type_id :integer
#  year                 :integer          not null
#  nodes_ids            :integer          is an Array
#  name                 :text
#  name_tsvector        :tsvector
#  node_type            :text
#  geo_id               :text
#  is_unknown           :boolean
#
# Indexes
#
#  nodes_with_flows_per_year_node_id_idx  (node_id)
#

# Only needs to be refreshed once after data upload. Used in dashboards mviews.
module Api
  module V3
    module Readonly
      class NodeWithFlowsPerYear < Api::Readonly::BaseModel
        include Api::V3::Readonly::MaterialisedTable

        self.table_name = 'nodes_with_flows_per_year'

        INDEXES = [
          {columns: :node_id}
        ].freeze
      end
    end
  end
end
