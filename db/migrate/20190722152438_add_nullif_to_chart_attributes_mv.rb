class AddNullifToChartAttributesMv < ActiveRecord::Migration[5.2]
  def change
    Api::V3::Readonly::Attribute.refresh

    update_view :chart_attributes_mv,
                version: 3,
                revert_to_version: 2,
                materialized: true
  end
end
