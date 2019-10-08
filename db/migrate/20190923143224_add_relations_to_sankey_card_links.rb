class AddRelationsToSankeyCardLinks < ActiveRecord::Migration[5.2]
  def change
    add_reference :sankey_card_links, :commodity, foreign_key: true
    add_reference :sankey_card_links, :country, foreign_key: true
    add_reference :sankey_card_links, :cont_attribute, foreign_key: {to_table: :attributes}
    add_reference :sankey_card_links, :ncont_attribute, foreign_key: {to_table: :attributes}

    create_table :sankey_card_link_nodes do |t|
      t.references :sankey_card_link, foreign_key: true
      t.references :node, foreign_key: true
    end
  end
end
