class CreateNodesPerContextRankedByVolumePerYearMv < ActiveRecord::Migration[5.2]
  def change
    create_view :nodes_per_context_ranked_by_volume_per_year_mv,
      materialized: true

    add_index :nodes_per_context_ranked_by_volume_per_year_mv,
      [:context_id, :node_id],
      unique: true,
      name: 'nodes_per_context_ranked_by_volume_per_year_mv_unique_idx'
  end
end
