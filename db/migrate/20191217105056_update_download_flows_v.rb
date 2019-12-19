class UpdateDownloadFlowsV < ActiveRecord::Migration[5.2]
  def change
    update_view :download_flows_v,
      version: 3,
      revert_to_version: 2,
      materialized: false
  end
end
