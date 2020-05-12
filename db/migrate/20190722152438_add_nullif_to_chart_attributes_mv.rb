class AddNullifToChartAttributesMv < ActiveRecord::Migration[5.2]
  def change
    update_view :chart_attributes_mv,
                version: 3,
                revert_to_version: 2,
                materialized: true
  end
end
