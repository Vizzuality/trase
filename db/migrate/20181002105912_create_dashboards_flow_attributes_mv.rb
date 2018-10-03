class CreateDashboardsFlowAttributesMv < ActiveRecord::Migration[5.1]
  def change
    create_view :dashboards_flow_attributes_mv, materialized: true
    add_index :dashboards_flow_attributes_mv,
      [:attribute_id, :path],
      unique: true,
      name: 'dashboards_flow_attributes_mv_flow_id_attribute_id_idx'
    add_index :dashboards_flow_attributes_mv,
      :country_id,
      name: 'dashboards_flow_attributes_mv_country_id_idx'
    add_index :dashboards_flow_attributes_mv,
      :commodity_id,
      name: 'dashboards_flow_attributes_mv_commodity_id_idx'
    reversible do |dir|
      dir.up do
        add_index :dashboards_flow_attributes_mv,
          'path gist__int_ops',
          using: 'gist',
          name: 'dashboards_flow_attributes_mv_path_idx'
      end
    end
  end
end
