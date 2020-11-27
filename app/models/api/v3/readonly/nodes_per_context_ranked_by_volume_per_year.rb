# == Schema Information
#
# Table name: nodes_per_context_ranked_by_volume_per_year_mv
#
#  context_id   :integer
#  node_id      :integer
#  rank_by_year :jsonb
#
# Indexes
#
#  nodes_per_context_ranked_by_volume_per_year_mv_unique_idx  (context_id,node_id) UNIQUE
#
# Only needs to be refreshed once after data upload. Used in dashboards mviews.
module Api
  module V3
    module Readonly
      class NodesPerContextRankedByVolumePerYear < Api::Readonly::BaseModel
        include Api::V3::Readonly::MaterialisedView

        self.table_name = 'nodes_per_context_ranked_by_volume_per_year_mv'
      end
    end
  end
end
