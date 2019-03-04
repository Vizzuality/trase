class CreateQualCommodityProperties < ActiveRecord::Migration[5.2]
  def change
    create_table :qual_commodity_properties do |t|
      t.text :tooltip_text
      t.references :commodity, foreign_key: true
      t.references :qual, foreign_key: true

      t.timestamps
    end
  end
end
