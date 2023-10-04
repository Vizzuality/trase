class AddParentIdToResizeByAttributes < ActiveRecord::Migration[6.1]
  def change
    add_column :resize_by_attributes, :parent_id, :integer, foreign_key: {to_table: :resize_by_attributes}
    update_view :resize_by_attributes_v, version: 2, revert_to_version: 1, materialized: false
  end
end
