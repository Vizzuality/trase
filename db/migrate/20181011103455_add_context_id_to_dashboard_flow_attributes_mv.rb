class AddContextIdToDashboardFlowAttributesMv < ActiveRecord::Migration[5.1]
  def change
    # no-op
    # remove_index :dashboards_flow_attributes_mv,
    #              [:attribute_id, :path]
    add_index :dashboards_flow_attributes_mv,
              [:attribute_id, :path, :commodity_id, :country_id],
              unique: true,
              name: 'dashboards_flow_attributes_mv_unique_attr_flow_context_idx'
  end
end
