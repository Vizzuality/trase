class DropFlowNodesMv < ActiveRecord::Migration[5.2]
  def up
    drop_view :flow_nodes_mv, materialized: true
  end

  def down
    create_view :flow_nodes_mv, version: 1, materialized: true
  end
end
