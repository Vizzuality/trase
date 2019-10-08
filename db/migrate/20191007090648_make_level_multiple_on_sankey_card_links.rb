class MakeLevelMultipleOnSankeyCardLinks < ActiveRecord::Migration[5.2]
  def change
    remove_column :sankey_card_links, :level

    add_column :sankey_card_links, :level1, :boolean, null: false, default: false
    add_column :sankey_card_links, :level2, :boolean, null: false, default: false
    add_column :sankey_card_links, :level3, :boolean, null: false, default: false
  end
end
