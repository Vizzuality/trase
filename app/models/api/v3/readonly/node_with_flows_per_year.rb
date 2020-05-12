# == Schema Information
#
# Table name: nodes_with_flows_per_year
#
#  id                   :integer          not null, primary key
#  context_id           :integer          not null
#  country_id           :integer
#  commodity_id         :integer
#  node_type_id         :integer
#  context_node_type_id :integer
#  main_id              :integer
#  column_position      :integer
#  year                 :integer          not null
#  is_unknown           :boolean
#  name                 :text
#  name_tsvector        :tsvector
#  node_type            :text
#  geo_id               :text
#
# Indexes
#
#  nodes_with_flows_per_year_id_idx  (id)
#
# Only needs to be refreshed once after data upload. Used in dashboards mviews.
module Api
  module V3
    module Readonly
      class NodeWithFlowsPerYear < Api::Readonly::BaseModel
        include Api::V3::Readonly::MaterialisedTable

        self.table_name = 'nodes_with_flows_per_year'

        INDEXES = [
          {columns: :id}
        ].freeze
      end
    end
  end
end
