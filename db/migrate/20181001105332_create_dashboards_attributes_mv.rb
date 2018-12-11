class CreateDashboardsAttributesMv < ActiveRecord::Migration[5.1]
  def change
    create_view :dashboards_attributes_mv, materialized: true
    add_index :dashboards_attributes_mv, :id, unique: true,
      name: 'dashboards_attributes_mv_id_idx'
    add_index :dashboards_attributes_mv, [:dashboards_attribute_group_id, :attribute_id],
      name: 'dashboards_attributes_mv_group_id_attribute_id_idx'
  end
end
