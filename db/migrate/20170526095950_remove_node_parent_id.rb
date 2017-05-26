class RemoveNodeParentId < ActiveRecord::Migration[5.0]
  def change
    remove_column :nodes, :parent_id, :integer
  end
end
