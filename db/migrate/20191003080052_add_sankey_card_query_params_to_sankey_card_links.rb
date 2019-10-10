class AddSankeyCardQueryParamsToSankeyCardLinks < ActiveRecord::Migration[5.2]
  def change
    add_column :sankey_card_links, :start_year, :integer, null: false
    add_column :sankey_card_links, :end_year, :integer, null: false

    add_reference :sankey_card_links, :biome, foreign_key: {to_table: :nodes}

    create_table :sankey_card_link_node_types do |t|
      t.references :context_node_type_property,
        foreign_key: true,
        index: {name: 'sankey_card_link_node_types_context_node_type_property_id_idx'}
      t.references :sankey_card_link, foreign_key: true
      t.references :node_type, foreign_key: true
    end
  end
end
