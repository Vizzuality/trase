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
