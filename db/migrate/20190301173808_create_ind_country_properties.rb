class CreateIndCountryProperties < ActiveRecord::Migration[5.2]
  def change
    create_table :ind_country_properties do |t|
      t.text :tooltip_text
      t.references :country, foreign_key: true
      t.references :ind, foreign_key: true

      t.timestamps
    end
  end
end
