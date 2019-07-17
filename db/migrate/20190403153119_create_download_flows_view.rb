class CreateDownloadFlowsView < ActiveRecord::Migration[5.2]
  def change
    create_view :download_flows_v, version: 1, materialized: false
  end
end
