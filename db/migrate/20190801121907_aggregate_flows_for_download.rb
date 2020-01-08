class AggregateFlowsForDownload < ActiveRecord::Migration[5.2]
  def change
    update_view :download_flows_v,
      version: 2,
      revert_to_version: 1,
      materialized: false

    remove_column :download_flows, :id
  end
end
