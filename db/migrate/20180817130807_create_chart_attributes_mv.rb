class CreateChartAttributesMv < ActiveRecord::Migration[5.1]
  def change
      create_view :chart_attributes_mv, materialized: true
      add_index :chart_attributes_mv, :id, unique: true,
        name: 'chart_attributes_mv_id_idx'
      add_index :chart_attributes_mv, [:chart_id],
        name: 'chart_attributes_mv_chart_id_idx'
  end
end
