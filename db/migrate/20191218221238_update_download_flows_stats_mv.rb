class UpdateDownloadFlowsStatsMv < ActiveRecord::Migration[5.2]
  def change
    update_view :download_flows_stats_mv,
      version: 2,
      revert_to_version: 1,
      materialized: true
  end
end
