class AddProfileTypeToNodeType < ActiveRecord::Migration[5.0]
  def change
    add_column :node_types, :profile_type, :string
  end
end
