class RenameSankeyCardLinksBiomeIdToNodeId < ActiveRecord::Migration[5.2]
  def change
    rename_column :sankey_card_links, :biome_id, :node_id
  end
end
