class CreateFlowIndicators < ActiveRecord::Migration[5.0]
  def change
    create_view :flow_indicators, materialized: true
    add_index :flow_indicators, :flow_id
  end
end
