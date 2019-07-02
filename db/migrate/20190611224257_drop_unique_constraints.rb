class DropUniqueConstraints < ActiveRecord::Migration[5.2]
  def up
    execute 'ALTER TABLE recolor_by_attributes DROP CONSTRAINT recolor_by_attributes_context_id_group_number_position_key'
    execute 'ALTER TABLE resize_by_attributes DROP CONSTRAINT resize_by_attributes_context_id_group_number_position_key'
  end

  def down
    execute 'ALTER TABLE recolor_by_attributes ADD CONSTRAINT recolor_by_attributes_context_id_group_number_position_key UNIQUE (context_id, group_number, position)'
    execute 'ALTER TABLE resize_by_attributes ADD CONSTRAINT resize_by_attributes_context_id_group_number_position_key UNIQUE (context_id, group_number, position)'
  end
end
