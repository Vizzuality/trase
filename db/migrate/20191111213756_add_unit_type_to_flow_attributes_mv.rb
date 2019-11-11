class AddUnitTypeToFlowAttributesMv < ActiveRecord::Migration[5.2]
  def change
    update_view :flow_attributes_mv,
      version: 3,
      revert_to_version: 1,
      materialized: true
  end
end
