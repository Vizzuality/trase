class DropDownloadFlowsMv < ActiveRecord::Migration[5.2]
  def change
    drop_view :download_flows_mv, materialized: true
    drop_view :flow_paths_mv, materialized: true
  end
end
