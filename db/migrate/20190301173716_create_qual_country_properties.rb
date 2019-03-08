class CreateQualCountryProperties < ActiveRecord::Migration[5.2]
  def change
    create_table :qual_country_properties do |t|
      t.text :tooltip_text, null: false
      t.references :country, foreign_key: true, null: false
      t.references :qual, foreign_key: true, null: false

      t.timestamps
    end
  end
end
