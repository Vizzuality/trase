class AddOnDeleteCascadeToChartNodeTypes < ActiveRecord::Migration[5.2]
  def change
    remove_foreign_key :chart_node_types, :charts
    remove_foreign_key :chart_node_types, :node_types
    add_foreign_key :chart_node_types, :charts, on_delete: :cascade
    add_foreign_key :chart_node_types, :node_types, on_delete: :cascade
  end
end
