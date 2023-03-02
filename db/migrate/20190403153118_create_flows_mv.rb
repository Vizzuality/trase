class CreateFlowsMv < ActiveRecord::Migration[5.2]
  def change
    create_view :flows_mv, version: 1, materialized: true
    add_index :flows_mv, :id, unique: true, name: 'flows_mv_unique_idx'
    add_index :flows_mv, :context_id, name: 'flows_mv_context_id_idx'
    add_index :flows_mv, :year, name: 'flows_mv_year_idx'
  end
end
