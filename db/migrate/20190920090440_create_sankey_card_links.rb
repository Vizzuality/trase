class CreateSankeyCardLinks < ActiveRecord::Migration[5.2]
  def change
    create_table :sankey_card_links do |t|
      t.json :link, null: false
      t.text :title, null: false
      t.text :subtitle

      t.timestamps
    end
  end
end
