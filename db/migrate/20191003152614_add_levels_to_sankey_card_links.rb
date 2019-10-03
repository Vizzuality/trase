class AddLevelsToSankeyCardLinks < ActiveRecord::Migration[5.2]
  def change
    add_column :sankey_card_links, :level, :integer, null: false
  end
end
