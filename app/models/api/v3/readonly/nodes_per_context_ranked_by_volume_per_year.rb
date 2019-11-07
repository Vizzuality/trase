# Only needs to be refreshed once after data upload. Used in dashboards mviews.
module Api
  module V3
    module Readonly
      class NodesPerContextRankedByVolumePerYear < Api::Readonly::BaseModel
        self.table_name = 'nodes_per_context_ranked_by_volume_per_year_mv'
      end
    end
  end
end
