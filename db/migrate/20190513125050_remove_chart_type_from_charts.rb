class RemoveChartTypeFromCharts < ActiveRecord::Migration[5.2]
  def change
    remove_column :charts, :chart_type
  end
end
