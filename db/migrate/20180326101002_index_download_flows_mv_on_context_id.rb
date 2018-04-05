class IndexDownloadFlowsMvOnContextId < ActiveRecord::Migration[5.1]
  def change
    add_index :download_flows_mv,
      [:context_id],
      name: 'download_flows_mv_context_id_idx'
  end
end
