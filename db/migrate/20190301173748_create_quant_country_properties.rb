class CreateQuantCountryProperties < ActiveRecord::Migration[5.2]
  def change
    create_table :quant_country_properties do |t|
      t.text :tooltip_text
      t.references :country, foreign_key: true
      t.references :quant, foreign_key: true

      t.timestamps
    end
  end
end
