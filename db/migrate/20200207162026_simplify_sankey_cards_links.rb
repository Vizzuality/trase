class SimplifySankeyCardsLinks < ActiveRecord::Migration[5.2]
  def change
    remove_column :sankey_card_links, :host
    remove_column :sankey_card_links, :node_id
    remove_column :sankey_card_links, :cont_attribute_id
    remove_column :sankey_card_links, :ncont_attribute_id
    remove_column :sankey_card_links, :start_year
    remove_column :sankey_card_links, :end_year
    add_column :sankey_card_links, :link, :text

    drop_table :sankey_card_link_nodes
    drop_table :sankey_card_link_node_types
  end
end
