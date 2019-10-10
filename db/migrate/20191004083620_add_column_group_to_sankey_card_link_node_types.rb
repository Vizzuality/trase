class AddColumnGroupToSankeyCardLinkNodeTypes < ActiveRecord::Migration[5.2]
  def change
    add_column :sankey_card_link_node_types, :column_group, :integer, null: false
  end
end
