class CreateDownloadFlowsStatsMv < ActiveRecord::Migration[5.2]
  def up
    create_view :download_flows_stats_mv, version: 1, materialized: true

    add_index :download_flows_stats_mv,
      [:context_id, :year, :attribute_type, :attribute_id],
      unique: true,
      name: 'download_flows_stats_mv_id_idx'
  end

  def down
    drop_view :download_flows_stats_mv, materialized: true
  end
end
