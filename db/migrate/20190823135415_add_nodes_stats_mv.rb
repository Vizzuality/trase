class AddNodesStatsMv < ActiveRecord::Migration[5.2]
  def change
    create_view :nodes_stats_mv,
      materialized: true,
      version: 1

    add_index :nodes_stats_mv,
      [:context_id, :year, :quant_id, :node_id, :node_type_id],
      unique: true,
      name: 'nodes_stats_mv_context_year_quant_node_node_type_idx'
  end
end
