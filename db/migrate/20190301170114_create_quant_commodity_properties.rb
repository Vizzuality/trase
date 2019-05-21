class CreateQuantCommodityProperties < ActiveRecord::Migration[5.2]
  def change
    create_table :quant_commodity_properties do |t|
      t.text :tooltip_text, null: false
      t.references :commodity, foreign_key: true, null: false
      t.references :quant, foreign_key: true, null: false

      t.timestamps
    end
  end
end
