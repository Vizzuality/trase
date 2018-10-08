class CreateDashboardsNodeAttributesMv < ActiveRecord::Migration[5.1]
  def change
    create_view :dashboards_node_attributes_mv, materialized: true
    add_index :dashboards_node_attributes_mv,
      [:node_id, :attribute_id],
      unique: true,
      name: 'dashboards_node_attributes_mv_node_id_attribute_id_idx'
  end
end
