class CreateSankeyCardLinks < ActiveRecord::Migration[5.2]
  def change
    create_table :sankey_card_links do |t|
      t.text :host, null: false
      t.json :query_params, null: false
      t.text :title, null: false
      t.text :subtitle

      t.timestamps
    end
  end
end
