class UpdateDownloadFlowsMvToHandleNewZdValues < ActiveRecord::Migration[5.2]
  def change
    update_view :download_flows_mv,
      version: 4,
      revert_to_version: 3,
      materialized: true
  end
end
