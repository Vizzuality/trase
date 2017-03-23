class AddNodeParentId < ActiveRecord::Migration[5.0]
  def change
    add_column :nodes, :parent_id, :integer
  end
end
