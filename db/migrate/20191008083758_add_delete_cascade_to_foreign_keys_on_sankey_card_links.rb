class AddDeleteCascadeToForeignKeysOnSankeyCardLinks < ActiveRecord::Migration[5.2]
  def change
    remove_reference :sankey_card_links, :country, foreign_key: true
    remove_reference :sankey_card_links, :commodity, foreign_key: true
    remove_reference :sankey_card_links, :cont_attribute, foreign_key: {to_table: :attributes}
    remove_reference :sankey_card_links, :ncont_attribute, foreign_key: {to_table: :attributes}

    add_reference :sankey_card_links, :country, foreign_key: {on_delete: :cascade}
    add_reference :sankey_card_links, :commodity, foreign_key: {on_delete: :cascade}
    add_reference :sankey_card_links, :cont_attribute, foreign_key: {to_table: :attributes, on_delete: :cascade}
    add_reference :sankey_card_links, :ncont_attribute, foreign_key: {to_table: :attributes, on_delete: :cascade}
  end
end
