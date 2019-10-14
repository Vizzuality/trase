class AddTypeAndIdToFlowAttributes < ActiveRecord::Migration[5.2]
  def up
    remove_index :flow_attributes_mv,
                 column: [:name, :display_name, :unit, :context_id]

    update_view :flow_attributes_mv,
      version: 2,
      revert_to_version: 1,
      materialized: true
    
    add_index :flow_attributes_mv,
      [:attribute_id, :context_id],
      unique: true,
      name: 'flow_attributes_mv_attribute_id_context_id_idx'
  end

  def down
    remove_index :dashboards_sources_mv,
                 column: [:attribute_id, :context_id]

    update_view :flow_attributes_mv,
      version: 1,
      materialized: true

    add_index :flow_attributes_mv,
      [:name, :display_name, :unit, :context_id],
      unique: true,
      name: 'flow_attributes_mv_name_display_name_unit_context_idx'
  end
end
