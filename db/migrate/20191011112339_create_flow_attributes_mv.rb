class CreateFlowAttributesMv < ActiveRecord::Migration[5.2]
  def up
    create_view :flow_attributes_mv,
      version: 1,
      materialized: true

    add_index :flow_attributes_mv,
      [:name, :display_name, :unit, :context_id],
      unique: true,
      name: 'flow_attributes_mv_name_display_name_unit_context_idx'
  end

  def down
    drop_view :flow_attributes_mv, materialized: true
  end
end
