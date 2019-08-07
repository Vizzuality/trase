class AddPrefixToContextNodeTypeProperties < ActiveRecord::Migration[5.2]
  def change
    add_column :context_node_type_properties, :prefix, :text
  end
end
